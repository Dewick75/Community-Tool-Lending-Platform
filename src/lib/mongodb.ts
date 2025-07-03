import mongoose from 'mongoose';

// Connection state tracking
let isConnected = false;

const connectMongoDB = async () => {
  // If already connected, return early
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    // Disconnect if there's an existing connection in a bad state
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log("Connecting to MongoDB...");

    // Connect with optimized settings
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      family: 4, // Use IPv4, skip trying IPv6
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");

  } catch (error) {
    isConnected = false;
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

// Function to check connection status
export const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    databaseName: mongoose.connection.db?.databaseName,
  };
};

// Function to disconnect
export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("🔌 Disconnected from MongoDB.");
  } catch (error) {
    console.error("❌ Error disconnecting from MongoDB:", error);
    throw error;
  }
};

export default connectMongoDB;