# CS544 Project
# Name: Tif HangKwai Pun

# ======================

# TODO:
# replace all ' by "
# replace paste by cat
# replace for (i in c(i:n)) by (i in i:n)

######### import data and libraries
load("inspections.RData")
library(ggplot2)
library(sampling)

######### define helper functions

# wrap a long string "x" into blocks of strings each with "len" characters. The function was adopted from: https://stat.ethz.ch/pipermail/r-help/2005-April/069566.html
wrap <- function(x, len)
{
  sapply(x, function(y) paste(strwrap(y, len),
                              collapse = "\n"),
         USE.NAMES = FALSE)
}

# define the "getSummaryStatistics" function to calculate the descriptive statistics (mean, median, standard deviation and 5 number summary) of the input data
get.summary.statistics = function(data){
  return (list(mean(data), median(data), sd(data), fivenum(data)))
}

######### define global variables
rank.labels = c("Poor", "Needs Improvement", "Adequate", "Good")
rank.colors = c("orangered", "goldenrod1", "darkturquoise", "olivedrab1")

# ======================

# =========================================================================
# Part 2 - Analysis on categorical and numerical data
# The following dimensions of the data will be analyzed:
# TODO: (list out dimensions)
# =========================================================================

# =======================================================
# Analyzing INSPECTIONS
# =======================================================

######### How many inspections have been performed over the past 3 years? #########
inspections.count = nrow(inspections)
cat(inspections.count, "inspections were done over the past three years")

######### How many inspections were done for the businesses in each rank? #########

# TODO: consider moving these to prep file
# Note: The analysis did not take into account the number of new businesses
inspections.poor = inspections[inspections$rank == rank.labels[1], ]
inspections.need.Imp = inspections[inspections$rank == rank.labels[2], ]
inspections.adeq = inspections[inspections$rank == rank.labels[3], ]
inspections.good = inspections[inspections$rank == rank.labels[4], ]

inspection.count.by.rank = c(nrow(inspections.poor),
                             nrow(inspections.need.Imp),
                             nrow(inspections.adeq),
                             nrow(inspections.good))

# add comment for the layout
layout(matrix(c(1, 2, 2), nrow = 1, ncol = 3))
layout.show ( n = 2)

pie(inspection.count.by.rank,
    labels = paste(rank.labels, "\n (", inspection.count.by.rank, ")"),
    col = rank.colors,
    main="Number of inspections \n by rank of business")

######### How many inspections were done in each quarter over the past 3 years? #########

# A function which calculates the number of inspections per quarter from 2014 Q1 to 2016 Q3
# Note: The inspection data of 2013 Q1-Q3 are missing, and the inspection data of 2013 Q4 and 2016 Q4 are not complete,
# therefore the inspection-by-quarter data will exclude the data from these periods of time
calculate.inspections.by.quarter = function(ins.subset){
  years = c(2014, 2015, 2016)
  quarters.start = c("01", "04", "07", "10")
  quarters.end = c("03", "06", "09", "12")
  number.of.quarters = length(years) * length(quarters.start)
  inspetcions.by.quarter = numeric(number.of.quarters)
  index = 1

  for(year in years){
    inspetcions.in.the.year = ins.subset[format.Date(ins.subset$date, "%Y")==year, ]
    # inspetcions.by.quarter[index] = nrow(inspetcions.in.the.year)
    # index = index + 1

    for(i in c(1:length(quarters.start))){
      inspections.in.a.quarter = inspetcions.in.the.year[(format.Date(inspetcions.in.the.year$date, "%m") >= quarters.start[i] &
                                                            format.Date(inspetcions.in.the.year$date, "%m") <= quarters.end[i]), ]
      inspetcions.by.quarter[index] = nrow(inspections.in.a.quarter)
      index = index + 1
    }
  }

  # the last number represents the number of inspections done in 2016 Q4. As mentioned above this item will be removed since the data is incomplete
  inspetcions.by.quarter = inspetcions.by.quarter[1:(number.of.quarters - 1)]

  return (inspetcions.by.quarter)
}

inspections.good.by.quarter = calculate.inspections.by.quarter(inspections.good)
inspections.adeq.by.quarter = calculate.inspections.by.quarter(inspections.adeq)
inspections.need.Imp.by.quarter = calculate.inspections.by.quarter(inspections.need.Imp)
inspections.poor.by.quarter = calculate.inspections.by.quarter(inspections.poor)

# A function which creates the quarter labels
generate.quarters.label = function(){

  year.labels = c("2014", "2015", "2016")
  quarter.labels = c("Q 1", "Q 2", "Q 3", "Q 4")
  number.of.quarters = length(year.labels) * length(quarter.labels)
  year.quarter.labels = character(length(year.labels) * length(quarter.labels))
  index = 1

  for(i in c(1:length(year.labels))){
    for(j in c(1:length(quarter.labels))){
      year.quarter.labels[index] = paste(year.labels[i], quarter.labels[j], sep="\n")
      index = index + 1
    }
  }

  # the last number represents the number of inspections done in 2016 Q4. As mentioned above this item will be removed since the data is incomplete
  year.quarter.labels = year.quarter.labels[1:(number.of.quarters - 1)]

  return (year.quarter.labels)
}

plot(inspections.good.by.quarter,
     type = "o",
     main = "Number of inspections (2014 Q1 - 2016 Q3)",
     col = rank.colors[1],
     xaxt = "n",
     xlab = "Quarter",
     ylab = "Count",
     ylim = c(0, 2500))
lines(inspections.adeq.by.quarter, type = "o", col = rank.colors[2])
lines(inspections.need.Imp.by.quarter, type = "o", col = rank.colors[3])
lines(inspections.poor.by.quarter, type = "o", col = rank.colors[4])
year.quarter.labels = generate.quarters.label()
axis(1, at=1:length(year.quarter.labels), labels=year.quarter.labels)
legend(5, 2500, rank.labels, lty=c(1,1, 1,1), lwd=c(2.5,2.5,2.5),col=rank.colors, cex = 0.9)

par(mfrow=c(1,1))

# =======================================================
# Analyzing VIOLATIONS
# =======================================================

######### Among these inspections, how many resulted in a violation? What's the percentage #########
violations = inspections[inspections$violation.description != "", ]
violations.count = nrow(violations)
violations.percentage = round(violations.count/inspections.count * 100)
cat(violations.percentage, "% of inspections resulted in one or more vioations")

violation.count.per.inspections = data.frame(table(violations$inspection.id))[[2]]
violation.count.per.inspections.5num = fivenum(violation.count.per.inspections)
violation.count.per.inspections.mean = mean(violation.count.per.inspections)
cat("In average, each inspection results in", signif(violation.count.per.inspections.mean, 3), "violations")
cat("The maximum number of violations resulted in one single inspection is", violation.count.per.inspections.5num[5])

######### Break down all violations by risks #########
layout(matrix(c(1, 2), nrow = 2, ncol = 1))
layout.show ( n = 2)

violations.by.risks = data.frame(table(violations$risk))
violations.by.risks = violations.by.risks[violations.by.risks$Freq > 0, ]
colnames(violations.by.risks) = c("Risk", "Number of violations")
labels = paste(violations.by.risks[[1]], "\n (", violations.by.risks[[2]], ")")

pie(violations.by.risks[["Number of violations"]],
    labels = labels,
    col = rank.colors,
    cex = 0.8,
    main="Violations by risks")

######### Break down all violations by ranks of businesses #########
violations.by.ranks = data.frame(table(violations$rank))
colnames(violations.by.ranks) = c("Rank", "Number of violations")
labels = paste(violations.by.ranks[[1]], "\n (", violations.by.ranks[[2]], ")")

pie(violations.by.ranks[["Number of violations"]],
    labels = labels,
    col = c("red", "yellow", "blue", "green"),
    cex = 0.8,
    main="Violations by business ranking")

par(mfrow=c(1,1))

######### What are 10 most common types of violations? #########
table(inspections$violation.description)
violations.freq.all.types.unsorted = data.frame(table(inspections$violation.description))
colnames(violations.freq.all.types.unsorted) = c("Type of violation", "Count")
violations.freq.all.types = violations.freq.all.types.unsorted[rev(order(violations.freq.all.types.unsorted["Count"])), ]

# filter out the inspections with no violations (i.e. the records with an empty "violation.description" value)
violations.types.freq = violations.freq.all.types[violations.freq.all.types["Type of violation"] != "", ]
violations.types.freq.top10 = head(violations.types.freq, 10)

# ** sort the data by description alphabetically
violations.types.freq.top10 = violations.types.freq.top10[with(violations.types.freq.top10, order(violations.types.freq.top10["Type of violation"], violations.types.freq.top10$Count)), ]

violations.types.freq.top10.labels = as.vector(violations.types.freq.top10[["Type of violation"]])

par(mar = c(6,5,2,2))
barplot(violations.types.freq.top10$Count,
        main = "10 most common types of violations",
        col = c("red"),
        names.arg = wrap(violations.types.freq.top10.labels, 18),
        las = 2,
        cex.axis = 0.8,
        cex.names = 0.7,
        ylab = "Count",
        ylim = c(0, 3500))
abline(h = 0)

######### Further break down each of the 10 top types of violations by rank #########

# first get all inspections with one of the top 10 violations
index.rank = c(which(names(inspections)=="rank"))
index.desc = c(which(names(inspections)=="violation.description"))
inspections.top10.violations = inspections[inspections$violation.description %in% c(violations.types.freq.top10.labels), c(index.rank, index.desc)]

# then calculate the inspection count for each rank for each type of violation
rank.freq = aggregate(x = inspections.top10.violations$rank,
                      by = list(rank = inspections.top10.violations$rank, description = inspections.top10.violations$violation.description),
                      FUN = length)
rank.freq = transform(rank.freq, description = reorder(rank.freq$description, rank.freq$x))
rank.freq[with(rank.freq, order(violations.types.freq.top10.labels, rank.freq$description)), ]

attach(rank.freq)
ggplot(rank.freq, aes(x = wrap(description, 18), y = rank.freq$x, fill = rank)) +
  ggtitle("10 most common types of violations by rank") +
  geom_bar(stat="identity") +
  xlab("") +
  ylab("Count") +
  theme(axis.text.x = element_text(angle = 90, hjust = 0, vjust = 0.6),
        plot.title = element_text(hjust = 0.5))
detach(rank.freq)

# =======================================================
# Analyzing BUSINESSES
# =======================================================

######### How did the number of inspected businesses change over time #########
layout(matrix(c(1, 2), nrow = 1, ncol = 2))
layout.show ( n = 2)

number.of.businesses = c(length(unique(inspections.14$business.id)),
                         length(unique(inspections.15$business.id)),
                         length(unique(inspections.16$business.id)))
barplot(number.of.businesses,
        main = "Number of businesses \n inspected each year",
        col = c("orange"),
        names.arg = c("2014", "2015", "2016"),
        ylim = c(0, 5000))
abline(h = 0)

######### How many businesses are there in each rank #########

businesses.count.by.ranks = data.frame(table(businesses$mean.rank))
colnames(businesses.count.by.ranks) = c("Rank", "Number of Businesses")
labels = paste(businesses.count.by.ranks[[1]], "\n (", businesses.count.by.ranks[[2]], ")")

pie(businesses.count.by.ranks[["Number of Businesses"]],
    labels = labels,
    col = c("red", "yellow", "blue", "green"),
    main="Number of businesses in each rank")


par(mfrow=c(1,1))

######### How did businesses' inspections rankings change over time #########

rank.differnce = table(businesses$original.rank, businesses$latest.rank)
dimnames(rank.differnce) = list(Original = rank.labels, Latest = rank.labels)
addmargins(rank.differnce)

# The table above shows the change of the number of businesses in each rank over the past 3 years. A few highlights:
# - 13 businesses ranked "Poor" in the original inspection received a "Good" ranking in the latest inspection
# - In contrast, 23 businesses ranked "Good" in the original inspection received a "Poor" ranking in the latest inspection
# - 118 businesses received a "Poor" ranking in the original inspection, in the latest inspection the number of businesses receiving the same ranking has gone up to 133
# - 3501 businesses received a "Good" ranking in the original inspection, but in the latest inspection the number of businesses receiving the same ranking has gone dwon to 3082

mosaicplot(rank.differnce,
           main = "Changes of businesses' rankings (2013 Q4 - 2016 Q4)",
           color = rank.colors)

# TODO: GRAPH doesn't make sense. Fix
barplot(rank.differnce,
        main = "Latest ranking",
        beside = T,
        legend.text = T,
        args.legend = list(x = "center"),
        col = rank.colors,
        ylim = c(0, 2600),
        xlab = "Original ranking",
        ylab = "Count")
abline(h = 0)

######### What's the distribution of the total number of inspections receivd by the businesses? #########

# first, examine the data by doing a 5 number summary and identify the number of outliers on both side
inspections.per.business = businesses$inspection.count
inspections.per.business.5num = fivenum(inspections.per.business)
inspections.per.business.iqr = IQR(inspections.per.business)
cat("The 5 number summary of the number of inspections received by each business is:", inspections.per.business.5num)
cat("The IQR of the number of inspections received by each business is:", inspections.per.business.iqr)

upper = inspections.per.business.5num[4] + 1.5*inspections.per.business.iqr
lower = inspections.per.business.5num[2] - 1.5*inspections.per.business.iqr
# The "lower" limit is < 0 but the number of inspections for each business must be >=1,
# it can be concluded that there's no outliers on the lower end
outliers.count = length(inspections.per.business[inspections.per.business > upper])
cat("Number of outliers of the inspections received by each business is:", outliers.count, ", all outliers lie on the upper end")

# Show the summary on a barplot
boxplot(inspections.per.business,
        main = "summary of the number of inspections",
        horizontal = T)

# Show the distribution on a histogram
hist(inspections.per.business,
     col = c("orange"),
     main = "Distribution of number of inspections",
     xlab = "Number of inspections",
     ylab = "Number of businesses",
     xlim = c(0, 40),
     ylim = c(0, 1500))
abline(h = 0)

######### Show the summaries of the total numbers of inspection for the businesses in each rank #########

businesses.poor = businesses[businesses$mean.rank == rank.labels[1], ]
businesses.need.Imp = businesses[businesses$mean.rank == rank.labels[2], ]
businesses.adeq = businesses[businesses$mean.rank == rank.labels[3], ]
businesses.good = businesses[businesses$mean.rank == rank.labels[4], ]

businesses.by.ranks = list(businesses.poor, businesses.need.Imp, businesses.adeq, businesses.good)
par(mfrow=c(length(businesses.by.ranks), 1))
for(i in c(1:length(businesses.by.ranks))){
  boxplot(businesses.by.ranks[[i]]$inspection.count,
          main = paste("Number of inspections (Rank =", rank.labels[i], ")"),
          ylim=c(0, 40),
          horizontal = T)
}
par(mfrow=c(1,1))

######### How many violations do businesses have? #########

hist(businesses$violation.count,
     col = c("red"),
     main = "Distribution of number of violations",
     xlab = "Number of violations",
     ylab = "Number of businesses",
     xlim = c(0, 40),
     ylim = c(0, 1500))
abline(h = 0)

head(businesses, 10)

######### Distribution of score #########
### TODO cleanup
# hist(businesses$mean.score,
#      col = c("red"),
#      main = "Distribution of business scores",
#      xlab = "Mean scores",
#      ylab = "Number of businesses")
# abline(h = 0)

# =======================================================
# Analyzing SCORES
# =======================================================

######### Use box plots to show the descriptive statistics of the inspection scores from all inspections and inspections by ranking #########

# set the spacing and layout for the plots
op <- par(mar = c(3,3,4,2))
layout(matrix(c(1, 1, 2, 3, 4, 5), nrow = 2, ncol = 3))
layout.show ( n = 5)

# summaries of the mean inspection scores for all businesses
boxplot(businesses$mean.score,
        main = "Mean inspection scores \n (All businesses)",
        ylim=c(50, 100))

# The boxplot above contains a lot of outliers at the lower end.
# In order to understand the pattern better, the data will be further broken down to show the summaries of the mean inspection scores for businesses in each rank
for(i in c(1:length(businesses.by.ranks))){
  boxplot(businesses.by.ranks[[i]]$mean.score,
          main = paste("Mean inspection scores \n (Rank =", rank.labels[i], ")"),
          ylim=c(50, 100),
          horizontal = T)
}
par(mfrow=c(1,1))

######### Is inspection score related to number of inspections?   #########

#TODO: cleanup
plot(businesses$inspection.count, businesses$mean.score)

# which correlation method to use: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3576830/
cor(businesses$inspection.count, businesses$mean.score, method = "spearman")
# see P.4 here http://www.statstutor.ac.uk/resources/uploaded/pearsons.pdf to describe the strength of correlation
# Evans JD. Straightforward Statistics for the Behavioral Sciences. Brooks/Cole Publishing; Pacific Grove, Calif.: 1996.
# also see http://www.statstutor.ac.uk/resources/uploaded/spearmans.pdf
# analyze: https://learnzillion.com/lesson_plans/6394-interpret-a-scatter-plot-by-identifying-clusters-and-outliers#lesson

######### Is inspection score related to number of violations?   #########

#TODO: cleanup
plot(businesses$violation.count, businesses$mean.score)
cor(businesses$inspection.count, businesses$mean.score)

######### How are inspection scores, number of inspections, and number of violations related?   #########

index.inspection.count = which(names(businesses)=="inspection.count")
index.violation.count = which(names(businesses)=="violation.count")
index.mean.score = which(names(businesses)=="mean.score")
pairs(businesses[, c(index.inspection.count, index.violation.count, index.mean.score)],
      main = "Relationship of inspection scores, \n number of inspections, and number of violations",
      pch = 16)

# =========================================================================
# Part 2 - Examine the distribution of the businesses$violation.count variable
# =========================================================================

######### Show the summaries of the total number of violations for 1. all businesses, 2. businesses in each rank #########

summary.stats.violation.count.all = get.summary.statistics(businesses$violation.count)
# summary.stats.violation.count.poor = get.summary.statistics(businesses.by.ranks[[1]]$violation.count)
# summary.stats.violation.count.need.Imp = get.summary.statistics(businesses.by.ranks[[2]]$violation.count)
# summary.stats.violation.count.adeq = get.summary.statistics(businesses.by.ranks[[3]]$violation.count)
# summary.stats.violation.count.good = get.summary.statistics(businesses.by.ranks[[4]]$violation.count)

cat("For all businesses, the mean, median and standard deviation of the total number of violations are:",
    summary.stats.mean.scores.all[[1]], ",", summary.stats.violation.count.all[[2]], ", and", summary.stats.violation.count.all[[3]], "respectively")
cat("For all businesses, the 5 number summary of the total number of violation is:", summary.stats.violation.count.all[[4]])

######### Use box plots to show the descriptive statistics of the violation count from all inspections and violation count by business ranking #########

# set the spacing and layout for the plots
op <- par(mar = c(3,3,4,2))
layout(matrix(c(1, 1, 2, 3, 4, 5), nrow = 2, ncol = 3))
layout.show ( n = 5)

# summaries of the total number of violations of all businesses
boxplot(businesses$violation.count,
        main = "1 Total violation count \n (All businesses)",
        ylim=c(0, 40))

# The boxplot above contains a lot of outliers at the upper end.
# In order to understand the pattern better, the data will be further broken down to show the summaries of the total violation count for businesses in each rank
for(i in c(1:length(businesses.by.ranks))){
  boxplot(businesses.by.ranks[[i]]$violation.count,
          main = paste((i + 1), "Total violation count \n (Rank =", rank.labels[i], ")"),
          ylim=c(0, 40),
          horizontal = T,
          col = rank.colors[i])
}
par(mfrow=c(1,1))

######### Show the violation count on PDF histogram plots #########

# In all boxplots above, most of the data cluster around the lower end and boxplots 1, 3, 4, and 5 also contain a a lot of outliers on the upper end.
# To better reveal the distribution pattern of each set of the data, the following density distribution plots will be created.

# ======================
#########  first define reusable helper functions and variables
xlim.max = 40

# break down the violations by ranks of businesses
violations.by.ranks = list(businesses.poor$violation.count, businesses.need.Imp$violation.count, businesses.adeq$violation.count, businesses.good$violation.count)

# generate a histogram for the nunber of violations using the given subset of businesses and title
# rank.id is an optional value from c(1:4) and it corresponds to an item in c("Poor", "Needs Improvement", "Adequate", "Good")
create.pdf.histogram = function(data.set, title, rank.id = 0){

  # generate the graph title and determine the color of the bars
  if(rank.id > 0 ) {
    graph.title = paste("Graph ", (rank.id + 1), "\n", title)
    # graph.title = paste("Graph ", (rank.id + 1), "\n PDF of violations \n (Rank =", rank.labels[rank.id], ")")
    color = rank.colors[rank.id]
  } else {
    graph.title = paste("Graph 1 \n", title)
    color = "gray88"
  }

  # generate the PDF histogram
  hist(data.set,
       probability = T,
       main = graph.title,
       xlab = "Total number of violations",
       xlim = c(0, xlim.max),
       ylim = c(0, 0.25),
       col = color)
}

# generate an exponential distribution curve based on the given subset of businesses
# rank.id is an optional value from c(1:4) and it corresponds to an item in c("Poor", "Needs Improvement", "Adequate", "Good")
create.exp.distributon.curve = function(data.set, rank.id = 0){

  # The formula listed on http://wiki.analytica.com/index.php?title=Exponential was use calculate the rate (lambda) parameters
  lambda = 1/mean(data.set)

  # generate the exponential line
  curve(dexp(x, rate = lambda), add = T, lwd = 2)
}

# generate a gamma distribution curve based on the given subset of businesses
# rank.id is an optional value from c(1:4) and it corresponds to an item in c("Poor", "Needs Improvement", "Adequate", "Good")
create.gamma.distributon.curve = function(data.set, rank.id = 0){
  mean.data.set = mean(data.set)
  var.data.set = var(data.set)

  # The formula listed on http://wiki.analytica.com/index.php?title=Gamma was use calculate the shape (alpha) and scale (beta) parameters
  alpha = mean.data.set^2/var.data.set
  beta = var.data.set/mean.data.set

  # generate the gamma line
  curve(dgamma(x, shape = alpha, scale = beta), add = T, lwd = 2)
}

# define the layout for the PDF histograms.
set.graphs.layout = function(){
  layout(matrix(c(1, 0, 2, 3, 4, 5), nrow = 2, ncol = 3))
  layout.show(n = 5)
}

# ======================

## Create the PDF histograms for each set of data, and overlay a line on it showing the change of density

# set the spacing and layout for the plots
op <- par(mar = c(7,5,4,2))
set.graphs.layout()

# draw the PDF histogram for the violation counts of all businesses (Graph 1)
violations.all = businesses$violation.count
create.pdf.histogram(violations.all, "PDF of violations \n (All businesses)")
lines(density(violations.all, from = 0, to = xlim.max), lwd = 2)

# draw the PDF histograms for the violation counts of businesses in each ranking (Graph 2-5)
for(i in c(1:length(businesses.by.ranks))){
  violations.one.rank = violations.by.ranks[[i]]
  create.pdf.histogram(violations.one.rank, paste("PDF of violations \n (Rank = ", rank.labels[i], ")"), i)
  lines(density(violations.one.rank, from = 0, to = xlim.max), lwd = 2)
}

par(mfrow=c(1,1))

######### Examine the type of distribution #########

## TODO: to finalize
# The total violation count is a continuous variable, its distribution cannot follow a discrete distributions (e.g. binomial, discrete uniform, geometric etc.)
# From the density distribution graphs created in the step above, their asymetric shape indicates that they do not follow a normal distribution or a uniform distribution.
# Instead, all graphs are right skewed with graphs 2, 3, 4 have most outliers lying on the higher end, and graph 1 and 5 do not have any outliers on the lower end
# Therefore, it is possible that the data represented by graphs 2,3,4 follow a Gamma distribution, while the data in graphs 1 and 5 follow an exponential distribution
# To confirm if the violation count variable actually follow the two distributions, the following two goodness-of-fit tests will be performed:
#  1. Overlay a Gamma curve on graph 2, 3, 4; and overlay an exponential curve on graphs 1 and 5, and check how well the curve fit the graphs
#  2. Create a QQ plot for each subset of data against a sample dataset created using the Gamma/Exponential distribution
# Reference: https://www.r-bloggers.com/exploratory-data-analysis-quantile-quantile-plots-for-new-yorks-ozone-pollution-data/
# Reference: http://chg.ucsb.edu/publications/pdfs/2006_Husaketal_GammaDistribution.pdf
# Reference: http://people.stern.nyu.edu/adamodar/pdfiles/papers/statprimer.pdf

### Test 1: overlay a Gamma/Exponential curve on the density distribution graphs

# set the spacing and layout for the plots
op <- par(mar = c(7,5,4,2))
set.graphs.layout()

# Graph 1: Create the same PDF histograms for the total number of violations for all businesses, then overlay an exponential curve on it
create.pdf.histogram(violations.all, "Exponential curve on PDF \n (All businesses)")
create.exp.distributon.curve(violations.all)

# Graphs 2-4: PDF of number of violations of businesses in Poor, Needs Improvement and Adequete rankings, with the Gamma curve overlayed
for(i in c(1:3)){
  violations.one.rank = violations.by.ranks[[i]]
  create.pdf.histogram(violations.one.rank, paste("Gamma curve on PDF \n (Rank = ", rank.labels[i], ")"), i)
  create.gamma.distributon.curve(violations.one.rank)
}

# Graphs 5: PDF of number of violations of businesses in Good rankings, with the exponential curve overlayed
violations.one.rank = violations.by.ranks[[4]]
create.pdf.histogram(violations.one.rank, paste("Exponential curve on PDF \n (Rank = ", rank.labels[i], ")"), 4)
create.exp.distributon.curve(violations.all)

par(mfrow=c(1,1))

# From the graphs above, it can be seem that all except graph 5 follow their respective estimated distributions quite well.
# In test 2, QQ plots will be used to check how well the data fits the distribution

### Test 2: Test the distribution of the data using a QQ plot

layout(matrix(c(1, 0, 2, 3, 4, 5), nrow = 2, ncol = 3))
layout.show ( n = 5)

# TODO: cleanup

# exp: full
vio = businesses$violation.count # full
data.length = length(vio)
probabilities = (1:data.length)/(data.length+1)
quantiles = qexp(probabilities, rate = 1/mean(vio))
plot(sort(quantiles),
     sort(vio) ,
     xlab = 'Theoretical Quantiles from Exp Distribution',
     ylab = 'Sample Quqnatiles of Violations',
     main = 'Exponential QQ Plot \n (all businesses)')
abline(0,1)


# gamma: 1, 2, 3
for(i in c(1:3)){
  vio = violations.by.ranks[[i]] # full
  mean.vio = mean(vio)
  var.vio = var(vio)
  data.length = length(vio)
  probabilities = (1:data.length)/(data.length+1)
  quantiles = qgamma(probabilities, shape = mean.vio^2/var.vio, scale = var.vio/mean.vio)
  plot(sort(quantiles),
       sort(vio) ,
       xlab = 'Theoretical Quantiles from Gamma Distribution',
       ylab = 'Sample Quqnatiles of Violations',
       main = paste('Gamma QQ Plot \n (Business rank =', rank.labels[i], ")"),
       col = rank.colors[i])
  abline(0,1)
}

# exp: 4
# todo cleanup
vio = violations.by.ranks[[4]]  # 4
data.length = length(vio)
probabilities = (1:data.length)/(data.length+1)
quantiles = qexp(probabilities, rate = 1/mean(vio))
plot(sort(quantiles),
     sort(vio) ,
     xlab = 'Theoretical Quantiles from Exp Distribution',
     ylab = 'Sample Quqnatiles of Violations',
     main = paste('Exponential QQ Plot \n (Business rank =', rank.labels[4], ")"),
     col = rank.colors[4])
abline(0,1)

par(mfrow=c(1,1))

# =========================================================================
# Part 3 - Random sampling and Central Limit Theorem
# =========================================================================

# Set a seed value to ensure the results will be reproducible
set.seed(100)

# ======================

#########  define reusable helper functions

# For parts 3 and 4, 1000 samples of various sizes will be drawn
samples.count = 1000

# For parts 3 and 4, only the following two columns will be taken into account to reduce the size of data to be created
col.1 = which(colnames(businesses) == "violation.count")
col.2 = which(colnames(businesses) == "mean.rank")
businesses.violation.rank = businesses[, c(col.1, col.2)]

# sample colors
sample.colors = c("dodgerblue4", "darkorange", "green4", "red")

# print the mean, standard deviation and the sample size
# Please note: mean and standard deviation will both be rounded off to 2 signigicant figures
print.mean.and.sd = function(sample.size, mean, sd){
  paste("Sample size =", sample.size, ": Mean =", signif(mean, 2), "; SD =", signif(sd, 2), sep = " ")
}

# calculate the sample means of the total number of violations
calculate.sample.means.violation.count = function(data.set, sample.size, stats){

  xbar = numeric(samples.count)
  for(i in c(1:samples.count)){
    xbar[i] = mean(data.set[[i]]$violation.count)
  }

  return (xbar)
}

# plot the sample means on a histogram
plot.sample.means.density.histogram = function(means, sample.size, sample.color){

  hist(means, prob = T,
       main=paste("PDF of means \n (Sample size = ", sample.size, ")"),
       xlab = "sample means",
       breaks = 10,
       xlim = c(5.5, 8),
       ylim = c(0, 4))
  lines(density(means, from = 5, to = 8), col = sample.color)
}

# ======================

# Reference: http://www.surveysystem.com/sscalc.htm

######### Draw 4 samples using simple random sampling, then compute the means of the violation.count variable for each sample.

# show the the descriptive statistics for each of the samples #########
stats.all = get.summary.statistics(violations.all) # (mean, median, standard deviation and 5 number summary)

# draw 1000 sample businesses records with the given size of it sample using simple random sampling without replacement
draw.1000samples.random = function(data.set, sample.size){

  random.samples = list(rep(0, samples.count))
  for(i in c(1:samples.count)){
    s = srswor(sample.size, nrow(data.set))
    one.sample = data.set[s != 0, ]
    random.samples[[i]] = one.sample
  }

  return(random.samples)
}

sample.sizes = c(200, 360, 900, 1700)
sample.random.200 = draw.1000samples.random(businesses.violation.rank, sample.sizes[1])
sample.random.360 = draw.1000samples.random(businesses.violation.rank, sample.sizes[2])
sample.random.900 = draw.1000samples.random(businesses.violation.rank, sample.sizes[3])
sample.random.1700 = draw.1000samples.random(businesses.violation.rank, sample.sizes[4])
samples.random = list(sample.random.200, sample.random.360, sample.random.900, sample.random.1700)

# for samples of each size, calculate the means of the number of violations for each sample
means.random.200 = calculate.sample.means.violation.count(sample.random.200, stats.all)
means.random.360 = calculate.sample.means.violation.count(sample.random.360, stats.all)
means.random.900 = calculate.sample.means.violation.count(sample.random.900, stats.all)
means.random.1700 = calculate.sample.means.violation.count(sample.random.1700, stats.all)
means.random = list(means.random.200, means.random.360, means.random.900, means.random.1700)

######### sketch the density distribution of the means of each sample #########

op <- par(mar = c(5,5,4,2))
layout(matrix(c(1, 2, 3, 4), nrow = 2, ncol = 2))
layout.show(n = 4)

for(i in c(1:length(means.random))){
  plot.sample.means.density.histogram(means.random[[i]], sample.sizes[i], sample.colors[i])
}

par(mfrow=c(1,1))

######### sketch the density distribution of each sample's means in one plot, and generate a QQ plot for each to check how well it fits the normal distribution #########

op <- par(mar = c(5,5,4,2))
# layout(matrix(c(1, 2, 3, 1, 4, 5), nrow = 3, ncol = 2))
layout(matrix(c(1, 1, 2, 3, 4, 5), nrow = 2, ncol = 3))
layout.show(n = 5)

# set up an "empty" plot so that lines can be added in the subsequent steps
# (The plot actually contains a point at (0, -1) but it will not be visible on the plot)
xlim.min = 5.5
xlim.max = 8
plot(-1,
     type="n",
     main = "Density distribution of \n the means of samples",
     ylab = "Density",
     xlab = "means",
     xlim = c(xlim.min, xlim.max),
     ylim = c(0, 4), lwd = 2)

# add the density lines and create the legend texts
legend.texts = character(4)
for(i in c(1:length(means.random))){
  lines(density(means.random[[i]], from = xlim.min, to = xlim.max), col = sample.colors[i], lwd = 2)
  legend.texts[i] = paste("size=", sample.sizes[i])
}
legend(xlim.min, 4.1, legend.texts, lty=c(1,1, 1,1), lwd=c(2.5,2.5,2.5),col=sample.colors, cex = 0.9)

# generate the QQ plots for each sample to examine how well the density distribution of the means can fit with normal distribution
for(i in c(1:length(means.random))){
  data.length = length(means.random[[i]])
  probabilities = (1:data.length)/(data.length+1)
  quantiles = qnorm(probabilities, mean = mean(means.random[[i]]), sd = sd(means.random[[i]]))
  plot(sort(quantiles),
       sort(means.random[[i]]) ,
       xlab = 'Theoretical Quantiles',
       ylab = 'Quqnatiles of sample',
       main = paste('Normal QQ Plot of sample means \n (sample size = ', sample.sizes[i], ")"))
  abline(0,1)
}

par(mfrow=c(1,1))

# TODO: writeup
# First talk about the exponential/gamma distribution of the data from Part 2,
# then talk about the consistent normal distribution of the sample means
# confirmed the finding using the QQ plots
# then compare the mean and sd of the sample means
# talk about CLT

# =========================================================================
# Part 4 - Draw samples with systematic sampling, unequal probability and Stratified sampling methods,
#          then compare them with the sample drawn using the random sampling technique.
#          Note:
#          - Two variables (one categorical, one numerical) will be used for the comparison.
#          - The sample size of 1700 businesses will be used throughout this part
# =========================================================================

population.size = nrow(businesses.violation.rank)
sample.size = sample.sizes[length(sample.sizes)]
# TODO rename variable
sample.colors.2 = c("gold", "dodgerblue", "orangered", "gray48")

######### Draw a sample using the random sampling method #########
# reuse one of the 1000 samples (sample size = 1700) drawn above
sample.random = sample.random.1700[[1]]

######### Draw a sample using the systematic sampling method #########

# calculate the number of items in each group
# then select a random item ranging from 1 to k from the first group
# and select every k-th item starting from item1
k = ceiling(population.size/sample.size)
item1 = sample(k, 1)
indices = seq(item1, by = k, length = sample.size)

## pick the corresponding rows from the dataset as the sample

# the "check.validity" function check if there is a corresponding business record with the given index
check.validity = function(index){
  # the index is valid as long as it is <= population.size
  return (index <= population.size)
}
check.validity = Vectorize(check.validity)
indices = indices[check.validity(indices)]

# Note: this sample contains less records than other records due to the validatiy check
sample.systematic = businesses.violation.rank[indices, ]

######### Draw a sample using the unequal probability method #########

# calculate the inclusion probabilities using the mean scores of businesses
pik = inclusionprobabilities(businesses$mean.score, sample.size)
s = UPsystematic(pik)
sample.prob = businesses.violation.rank[s != 0, ]
sample.prob

######### Draw a sample using the stratified sampling method with the proportional sizes based on the mean.ranking variable #########

businesses.sorted = businesses[order(businesses$mean.rank), c(col.1, col.2)]

frequencies.all = table(businesses$mean.rank)
population.freq = data.frame(frequencies.all)$Freq
st.sizes = round(sample.size * population.freq/sum(population.freq))

stratas = strata(businesses.sorted,
                 stratanames = c("mean.rank"),
                 size = st.sizes,
                 method = "srswor",
                 description = T)

sample.stratas = getdata(businesses.sorted, stratas)
sample.stratas

######### Next, the "mean.rank" variable (categorical) will be compared using the samples above #########

# TODO cleanup
# break down the businesses by their mean rank, then further break down each rank into samples collected by different methods

# for each sample, calculate the frequency  table using the mean.rank variable, then transpose the table
rank.freq.sample.random = data.frame(table(sample.random$mean.rank))
rank.freq.sample.systematic = data.frame(table(sample.systematic$mean.rank))
rank.freq.sample.prob = data.frame(table(sample.prob$mean.rank))
rank.freq.sample.stratas = data.frame(table(sample.stratas$mean.rank))

sample.names = gsub(" ", "\n", c("Random", "Systematic", "Unequal probabilities", "Stratified"))
rank.freq.all.samples = data.frame(
  rank.freq.sample.random$Freq,
  rank.freq.sample.systematic$Freq,
  rank.freq.sample.prob$Freq,
  rank.freq.sample.stratas$Freq,
  row.names = gsub(" ", "\n", rank.freq.sample.random$Var1))
colnames(rank.freq.all.samples) = sample.names

# plot the results on a bar plot
rank.freq.all.samples.t = t(rank.freq.all.samples)
names(rank.freq.all.samples.t) = rank.labels
barplot(rank.freq.all.samples.t,
        main = "Number of businesses in each sample",
        xlab = "Ranking of businesses",
        ylab = "Count",
        ylim = c(0, 1000),
        col = sample.colors.2,
        legend.text = TRUE,
        args.legend = list(x = 6.5, y = 1000, cex = 0.8),
        beside=TRUE)
abline(h = 0)

## TODO provide explanation
## consider removing systematic since it has less records

## ######### Finally, the "violation.count" variable (numerical) will also be compared using the samples above #########

## TODO also compare descriptive statistics of samples

# TODO change this to 4 plots
# systematic sample contains less records than other samples, therefore it needs to be removed in order to avoid creating a ragged data frame

violation.count.all.samples = list(rep(0, 4))
violation.count.all.samples[[1]] = sample.random$violation.count
violation.count.all.samples[[2]] = sample.systematic$violation.count
violation.count.all.samples[[3]] = sample.prob$violation.count
violation.count.all.samples[[4]] = sample.stratas$violation.count
# length(violation.count.all.samples)

layout(matrix(c(1, 2, 3, 4), nrow = 2, ncol = 2))
layout.show ( n = 4)

for(i in c(1:length(violation.count.all.samples))){
  boxplot(violation.count.all.samples[[i]],
          main = paste(sample.names[i], "sampling"),
          ylab = "Number of violations",
          ylim = c(0, 40),
          col = sample.colors.2[i],
          horizontal = T)
}

par(mfrow=c(1,1))

## TODO provide explanation
## consider removing systematic since it has less records

# =========================================================================
# Part 5 - For confidence levels of 80 and 90,
#          show the confidence intervals of the mean of the numeric variable for various samples
#          and compare against the population mean.
# =========================================================================

# The analysis in this part will also focus on the violation information of businesses.
# In this part, 20 samples will be drawn from the business records. Each sample will contain 50 business records

violations = businesses.violation.rank$violation.count

samples.count = 20
sample.size = 100

sd.violations = sd(violations)
mean.violations = mean(violations)
sd.sample.means = sd.violations/sqrt(sample.size)

########### helper function

calculate.confidence.intervals.for.samples = function(confidence.level){
  alpha = 1-confidence.level/100
  z = qnorm(confidence.level/100 + alpha/2)
  margin.of.error = z*sd.sample.means

  xbar = numeric(samples.count)
  for(i in i:samples.count){

    sample.data.1 = sample(violations, size = sample.size)
    xbar[i] = mean(sample.data.1)

    confidence.interval.lower = xbar[i] - margin.of.error
    confidence.interval.upper = xbar[i] + margin.of.error

    str = sprintf("%d: %d%% Confidence Level, Sample Mean = %.2f, Confidence Interval = %.2f - %.2f",
                  i, confidence.level, xbar[i], confidence.interval.lower, confidence.interval.upper)
    cat(str, "\n")
  }

  # return the sample means
  return (list(xbar, margin.of.error))
}

get.out.of.range.means = function(result){
  result = result
  indices = c(abs(result[[1]]-mean.violations) > result[[2]]*sd.sample.means)
}

plot.means.comparison = function(result, confidence.level, out.of.range.indices){
  colors = rep("black", samples.count)
  for(i in 1:length(out.of.range.indices)){
    if(out.of.range.indices[i] == T)
      colors[i] = "red"
  }

  matplot(rbind(result[[1]] - result[[2]]*sd.sample.means, result[[1]] + result[[2]]*sd.sample.means),
          rbind(1:samples.count, 1:samples.count),
          main = paste("Confidence intervals vs. population mean \n (Confidence level =", confidence.level, ", sample size =", sample.size, " )"),
          xlab = "Confidence interval",
          ylab = "Sample",
          type="l",
          lty=1,
          cex.main=0.9,
          cex.lab = 0.9,
          col = colors)
  abline(v = mean.violations)
}

########### Calculate the confidence intervals of the mean for confidence level 80 and 90, means of the samples with the population mean
result.80 = calculate.confidence.intervals.for.samples(80)
out.of.range.indices.80 = get.out.of.range.means(result.80)
paste(sum(out.of.range.indices.80), "sample(s) has the sample mean(s) outside of the confidence interval")

result.90 = calculate.confidence.intervals.for.samples(90)
out.of.range.indices.90 = get.out.of.range.means(result.90)
paste(sum(out.of.range.indices.90), "sample(s) has the sample mean(s) outside of the confidence interval")

########### Plot on graphs

layout(matrix(c(1, 2), nrow = 2, ncol = 1))
layout.show(n = 2)

plot.means.comparison(result.80, 80, out.of.range.indices.80)
plot.means.comparison(result.90, 90, out.of.range.indices.90)

par(mfrow=c(1,1))


