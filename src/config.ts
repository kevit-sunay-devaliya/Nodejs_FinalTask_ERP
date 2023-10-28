const Config = {
	  // Configuration object for the application
	mongodb: {
		// MongoDB connection URL, defaults to a local MongoDB instance if not specified
		url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/ERP',
	},
	server: {
		// Server port, defaults to 8000 if not specified
		port: process.env.PORT || 8000,
		// Log level for general logging, defaults to "all" if not specified
		logLevel: process.env.LOG_LEVEL || 'all',
		// Log level for alert/error logging, defaults to "error" if not specified
		alertLogLevel: process.env.ALERT_LOG_LEVEL || 'error',
		 // Webhook URL, if specified in the environment variables
		webhookUrl: process.env.WEBHOOK_URL,
		// Environment mode (e.g., "development," "production"), if specified
		env: process.env.NODE_ENV,
		//Private Key for Authentication
		private: process.env.PRIVATE || 'thisissecret'
	},
};

// Export the configuration object for use in other parts of the application
export default Config;
