const  cron =  require("node-cron")

// Run every minute
cron.schedule('* * * * *', () => {
  console.log("Cron job running every minute");
});

// Run every day at 12 AM
cron.schedule('0 0 * * *', () => {
  console.log("Daily cron at midnight");
});
