install.packages("ggplot2")
install.packages("scales")
library(ggplot2)
library(scales)
setwd("/Users/william/Documents/GitHub/puscioly/scripts/")
df <- read.csv("RawScoreGrid2019.csv", header=TRUE, check.names = FALSE)

for (col in colnames(df)) {
  x <- as.numeric(levels(df[,col]))[df[,col]]
  plot <- ggplot(df, aes(x)) + geom_histogram(bins=9, colour="black", fill="#A4DDDF") + 
    geom_vline(aes(xintercept=mean(df[, col], na.rm=T)), color="red", linetype="dashed", size=1) + xlab("Score") + 
    ylab("Frequency") + ggtitle(col) + 
    theme(axis.text=element_text(size=14), axis.title=element_text(size=16,face="bold"), plot.title=element_text(size=20,hjust = 0.5,margin=margin(t=10,b=10))) + 
    scale_x_continuous(breaks= pretty_breaks()) + scale_y_continuous(breaks= pretty_breaks())
  ggsave(paste0("Plots/",col,".png"), plot)
}
# Mousetrap is weird
df$`Mousetrap Vehicle`[which(df$`Mousetrap Vehicle` == 0)] <- NaN
col <- 'Mousetrap Vehicle'
x <- as.numeric(levels(df[,col]))[df[,col]]
plot <- ggplot(df, aes(x)) + geom_histogram(colour="black", fill="#A4DDDF") + 
  geom_vline(aes(xintercept=mean(df[, col], na.rm=T)), color="red", linetype="dashed", size=1) + xlab("Score") + 
  ylab("Frequency") + ggtitle(col) + 
  theme(axis.text=element_text(size=14), axis.title=element_text(size=16,face="bold"), plot.title=element_text(size=20,hjust = 0.5,margin=margin(t=10,b=10))) + 
  scale_x_continuous(breaks = c(seq(0, 100, by=10), max(df$`Mousetrap Vehicle`, na.rm = T))) + scale_y_continuous(breaks= pretty_breaks())
ggsave(paste0("Plots/",col,".png"), plot)

