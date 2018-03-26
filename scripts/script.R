library(ggmap)
library(zipcode)
setwd("/Users/dfan/Dropbox (Personal)/Programming/Projects/puscioly/scripts")
df <- read.csv("schools2018.csv", colClasses = c("character", "double", "character", "character", "character", "double", "logical"))
data(zipcode)
df$Latitude <- sapply(df$Zip, function(x) {
  zipcode[which(zipcode$zip == x), "latitude"]
})
df$Longitude <- sapply(df$Zip, function(x) {
  zipcode[which(zipcode$zip == x), "longitude"]
})

paste0("Total teams: ", sum(df$Teams))
paste0("Schools with 1 team: ", length(which(df$Teams == 1)))
paste0("Schools with 2 teams: ", length(which(df$Teams == 2)))
paste0("Total States represented: ", length(unique(df$State)))
paste0("States with school(s) sending 2 teams: ", length(unique(df[which(df$Teams == 2), "State"])))

paste0("Number of teams from NJ: ", sum(df[which(df$State == "NJ"), "Teams"]))
paste("Schools from NJ sending 2 teams:")
df[which(df$State == "NJ" & df$Teams == 2), "School"]

paste0("Number of returning schools: ", sum(df$PrevAttendee))
paste0("Number of returning teams: ", sum(df[which(df$PrevAttendee == TRUE), "Teams"]))

paste0("Mean miles from Princeton: ", mean(df$Distance))
quantile(df$Distance)


usa_center <- as.numeric(geocode("United States"))
ggmap(get_googlemap(center=usa_center, scale=2, zoom=4), extent="normal") +
 geom_point(data=df, aes(x=Longitude, y=Latitude), color = "red", size = 1, alpha = 0.5)

ggplot(data = df) + 
  geom_polygon(aes(x = Longitude, y = Latitude, fill = StateFull), color = "white") + 
  coord_fixed(1.3) +
  guides(fill=FALSE)

ggplot(data = states) + 
  geom_polygon(aes(x = long, y = lat, fill = region), color = "white") + 
  coord_fixed(1.3) +
  guides(fill=FALSE)