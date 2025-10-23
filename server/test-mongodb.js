const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing MongoDB connection...');
  console.log('📡 URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env file');
    console.log('💡 Please create a .env file with your MongoDB URI');
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('🏠 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // Test a simple operation
    console.log('📁 Listing collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Available collections:', collections.map(c => c.name));
    
    // Test creating a simple document
    console.log('🧪 Testing write operation...');
    const testCollection = mongoose.connection.db.collection('connection_test');
    const testDoc = { 
      test: true, 
      timestamp: new Date(),
      message: 'MongoDB connection test successful'
    };
    
    const result = await testCollection.insertOne(testDoc);
    console.log('✅ Write test successful! Document ID:', result.insertedId);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    console.log('🎉 All tests passed! Your MongoDB connection is working perfectly.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('🔍 Error type:', error.name);
    console.error('📝 Error message:', error.message);
    
    if (error.code) {
      console.error('🔢 Error code:', error.code);
    }
    
    if (error.code === 11000) {
      console.log('💡 This might be a duplicate key error');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Check your username and password in the URI');
    } else if (error.message.includes('network')) {
      console.log('💡 Check your network connection and MongoDB server status');
    } else if (error.message.includes('invalid')) {
      console.log('💡 Check your MongoDB URI format');
    }
    
    process.exit(1);
  }
}

testConnection();
