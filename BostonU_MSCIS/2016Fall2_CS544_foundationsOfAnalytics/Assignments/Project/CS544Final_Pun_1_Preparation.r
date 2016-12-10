# CS544 Project
# Name: Tif HangKwai Pun

# =======================================================
# Data Preparation ======================================
# =======================================================

# =======================================================
# Part 1 - Basic understanding to the data:
# The data used in this analysis was exported from the San Francisco Open Data site into a CSV file:
# https://data.sfgov.org/Health-and-Social-Services/Food-Inspections-LIVES-Standard/pyih-qa8i/data
# Note: the data is updated regularly so the csv file (last exported on Dec 2, 2016) used in this analysis might be slightly more dated than the data from the site above
#
# In this dataset, each row represents one inspection. An inspection might or might not carry a score. For example, scoring is not needed for new business inspections but regular inspections doe.
# In addition, if a business was not found to have a violation, the "violation.description" information will be blank
# =======================================================

csv = read.csv("Food_Inspections.csv")

# pick only the attributes that are relevant to the the analysis.
# Note that the "inspection_date" attribute in the csv file contains the time information (12:00:00 AM). This information is not needed so the "date" column will be formatted to only show the month, date, and year information
data.all = data.frame(
  inspection.id = csv$inspection_id,
  business.id = csv$business_id,
  name = csv$business_name,
  zip.code = csv$business_postal_code,
  date = as.Date(csv$inspection_date, format="%m/%d/%Y"),
  score = csv$inspection_score,
  risk = csv$risk_category,
  violation.description = csv$violation_description
)

# filter out the inspections which don't have an inspection score. These include inspections for new businessses/business with a new ownership, inspected due to complaints or follow-up inspections.
# The business will not receive a score at the end of these types of inspections and so these inspections will be removed from the dataset
data.unsorted = data.all[is.na(data.all$score) == F, ]

# sort the data based on inspection date (most recent first)
data.sorted = data.unsorted[rev(order(data.unsorted$date)), ]

# add a new column "rank" to show the operating condition category of a business.
# The rank is calculated from the inspection score. The score/rank conversion is based on the table at: https://www.sfdph.org/dph/EH/Food/Score/
score.breaks = c(0, 70, 85, 90, 100)
score.labels = c("Poor", "Needs Improvement", "Adequate", "Good")
ranks = cut(data.sorted$score, breaks = score.breaks, labels = score.labels)

# insert the "rank" column after the "score" column
score.index = which(names(data.sorted)=="score")
last.index = ncol(data.sorted)
inspections = data.frame(data.sorted[1:score.index], rank = ranks, data.sorted[(score.index + 1):last.index])

# =======================================================
# Part 2 - inspection data per business
# The following "businesses" data frame shows the number of inspections, number of violations, mean inspection score, mean insection rank per business,
# original ranking from the first inepction as well as the latest ranking from the most recent inspections
# Note that the mean scores are rounded to the whole integer
# =======================================================

# get the number of inspections per business
inspection.freq = data.frame(table(inspections$business.id))

business.ids = inspection.freq[[1]]

# get the mean inspection score per business
scores <- aggregate(x = inspections$score,
                    by = list(business.id = inspections$business.id),
                    FUN = mean)
# convert the mean scores to rank per business
ranks = cut(scores$x, breaks = score.breaks, labels = score.labels)

# get the number of violations per business
get.violation.count = function(descriptions){
  # get the inspections with violations (i.e. descriptions is not an empty string), then return the count
  has.violations = descriptions[descriptions != ""]
  return (length(has.violations))
}
violations <- aggregate(x = inspections$violation.description,
                        by = list(business.id = inspections$business.id),
                        FUN = get.violation.count)

# the following function retrieves the rankings the businesses during their earliest inspections
get.businesses.original.rankings = function(){

  inspection.count = nrow(inspections)
  business.count = length(business.ids)

  ## sort the inspections by date (oldest at the top)
  inspections.old.to.new = inspections[order(inspections$date), ]

  # the following data frame stores the business ids as well as their first inspection ranking
  rank.original = data.frame(
    business.id = character(),
    rank = character(),
    stringsAsFactors = F)

  # loop through each inspection. When encountering a new business.id, add it and its ranking to the rank.original data frame
  # break the loop when the number of rows of rank.original matches the total number of businesses
  for(i in c(1:inspection.count)){
    if(nrow(rank.original) == business.count)
      break

    if(inspections.old.to.new$business.id[i] %in% rank.original$business.id == F)
      rank.original = rbind(rank.original, data.frame(business.id = inspections.old.to.new$business.id[i], rank = inspections.old.to.new$rank[i]))
  }

  # sort the data by business ids
  rank.original = rank.original[order(rank.original$business.id),]

  return (rank.original)
}
rank.original = get.businesses.original.rankings()

# the following function retrieves the rankings the businesses during their latest inspections
get.businesses.latest.rankings = function(){
  inspection.count = nrow(inspections)
  business.count = length(business.ids)

  ## sort the inspections by date (oldest at the top)
  inspections.new.to.old = inspections[rev(order(inspections$date)), ]

  # the following data frame stores the business ids as well as their first inspection ranking
  rank.latest = data.frame(
    business.id = character(),
    rank = character(),
    stringsAsFactors = F)

  # loop through each inspection. When encountering a new business.id, add it and its ranking to the rank.latest data frame
  # break the loop when the number of rows of rank.latest matches the total number of businesses
  for(i in c(1:inspection.count)){
    if(nrow(rank.latest) == business.count)
      break

    if(inspections.new.to.old$business.id[i] %in% rank.latest$business.id == F)
      rank.latest = rbind(rank.latest, data.frame(business.id = inspections.new.to.old$business.id[i], rank = inspections.new.to.old$rank[i]))
  }

  # sort the data by business ids
  rank.latest = rank.latest[order(rank.latest$business.id),]

  return (rank.latest)
}
rank.latest = get.businesses.latest.rankings()
# table(data.frame(table(rank.latest$business.id))[2]) # check for uniqueness

# cretae the data frame
businesses = data.frame(
  id = business.ids,
  inspection.count = inspection.freq$Freq,
  violation.count = violations$x,
  mean.score = round(scores$x),
  original.rank = rank.original$rank,
  latest.rank = rank.latest$rank,
  mean.rank = ranks
)

# =======================================================
# Part 3 - inspection data per year
# The following data frames shows inspections done in the year of 2013, 2014, 2015 and 2016 respectively.
# Note that the first inspection record was collected in Dec 13, so it's expected that the number of inspections in 2013 will be lower than that of other years
# =======================================================
inspections.13 = inspections[format.Date(inspections$date, "%Y")=="2013", ]
inspections.14 = inspections[format.Date(inspections$date, "%Y")=="2014", ]
inspections.15 = inspections[format.Date(inspections$date, "%Y")=="2015", ]
inspections.16 = inspections[format.Date(inspections$date, "%Y")=="2016", ]

# =======================================================
# Part 4   - save the data into a RData file
# =======================================================

save(inspections,
     businesses,
     inspections.13,
     inspections.14,
     inspections.15,
     inspections.16,
     file="inspections.RData")