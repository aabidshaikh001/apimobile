const debugLogger = (req, res, next) => {
    // Log request details
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
  
    if (req.body && Object.keys(req.body).length > 0) {
      console.log("Body:", JSON.stringify(req.body, null, 2));
    }
  
    // Capture and log response
    const originalSend = res.send;
  
    // Use a regular function to access the `arguments` object
    res.send = function (data) {
      console.log(`Response Status: ${res.statusCode}`);
      try {
        const parsedData = JSON.parse(data);
        console.log("Response Body:", JSON.stringify(parsedData, null, 2));
      } catch (e) {
        console.log("Response Body: [unparseable]");
      }
  
      // Use `apply` to call the original `res.send` with all arguments
      return originalSend.apply(this, arguments);
    };
  
    next();
  };
  
  export default debugLogger;