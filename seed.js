import mongoose from "mongoose";
import dotenv from "dotenv";
import Vehicle from "./src/models/Vehicle.js";
import Payment from "./src/models/Payment.js";
import Company from "./src/models/Company.js";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

// Demo data
const companies = [
  { name: "ABC Logistics", description: "Premium logistics partner" },
  { name: "XYZ Transport", description: "Reliable transport services" },
  { name: "Delta Carriers", description: "Fast delivery specialists" },
];

const routes = ["Route A", "Route B", "Route C", "Route D", "Route E"];

const drivers = [
  { name: "Raj Kumar", number: "9876543210" },
  { name: "Amit Singh", number: "9876543211" },
  { name: "Priya Sharma", number: "9876543212" },
  { name: "Vikram Patel", number: "9876543213" },
  { name: "Neha Verma", number: "9876543214" },
  { name: "Arjun Desai", number: "9876543215" },
  { name: "Deepak Gupta", number: "9876543216" },
  { name: "Sanjay Kumar", number: "9876543217" },
];

const vehicles = [
  "MH12AB1001",
  "MH12AB1002",
  "MH12AB1003",
  "MH12AB1004",
  "MH12AB1005",
  "MH12AB1006",
  "MH12AB1007",
  "MH12AB1008",
  "MH12AB1009",
  "MH12AB1010",
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("✓ Connected to MongoDB");

    // Clear existing demo data
    await Vehicle.deleteMany({});
    await Payment.deleteMany({});
    console.log("✓ Cleared existing data");

    // Create companies (if not exist)
    let createdCompanies = [];
    for (const company of companies) {
      const existingCompany = await Company.findOne({ name: company.name });
      if (!existingCompany) {
        const newCompany = await Company.create(company);
        createdCompanies.push(newCompany);
        console.log(`✓ Created company: ${company.name}`);
      } else {
        createdCompanies.push(existingCompany);
        console.log(`✓ Found existing company: ${company.name}`);
      }
    }

    // Create demo vehicles
    const vehicleRecords = [];
    let vehicleIndex = 0;

    // Create vehicles for each company
    for (let companyIdx = 0; companyIdx < createdCompanies.length; companyIdx++) {
      const company = createdCompanies[companyIdx];
      const vehiclesPerCompany = 8 + companyIdx; // 8, 9, 10 vehicles per company

      for (let i = 0; i < vehiclesPerCompany; i++) {
        const baseDate = new Date(2024, 5, 1); // June 1, 2024
        const vehicleDate = new Date(baseDate);
        vehicleDate.setDate(vehicleDate.getDate() + i);

        const driverIndex = Math.floor(Math.random() * drivers.length);
        const routeIndex = Math.floor(Math.random() * routes.length);
        const vehicleIndex = i % vehicles.length;
        const priceOptions = [15000, 18000, 20000, 22000, 25000];
        const priceIndex = Math.floor(Math.random() * priceOptions.length);

        const vehicleRecord = await Vehicle.create({
          companyId: company._id.toString(),
          companyName: company.name,
          driverName: drivers[driverIndex].name,
          driverNumber: drivers[driverIndex].number,
          vehicleNumber: vehicles[vehicleIndex],
          route: routes[routeIndex],
          date: vehicleDate.toLocaleDateString("en-CA"),
          priceToDriver: priceOptions[priceIndex].toString(),
          additionalDetails: `Demo vehicle entry #${i + 1}`,
          paidStatus: "not paid",
        });

        vehicleRecords.push(vehicleRecord);
      }

      console.log(`✓ Created ${vehiclesPerCompany} vehicles for ${company.name}`);
    }

    console.log(`✓ Total vehicles created: ${vehicleRecords.length}`);

    // Create demo payments
    const paymentRecords = [];

    // Payment 1: ABC Logistics - 200,000 on June 15
    const payment1 = await Payment.create({
      companyId: createdCompanies[0]._id.toString(),
      companyName: createdCompanies[0].name,
      amount: 200000,
      paymentDate: new Date(2024, 5, 15),
      paymentMethod: "bank transfer",
      description: "Payment for first batch of vehicles",
      referenceNumber: "TXN20240615001",
      status: "completed",
      notes: "Received via NEFT",
    });
    paymentRecords.push(payment1);
    console.log("✓ Created payment 1: ABC Logistics - ₹200,000");

    // Payment 2: XYZ Transport - 150,000 on June 20
    const payment2 = await Payment.create({
      companyId: createdCompanies[1]._id.toString(),
      companyName: createdCompanies[1].name,
      amount: 150000,
      paymentDate: new Date(2024, 5, 20),
      paymentMethod: "check",
      description: "Check payment for June services",
      referenceNumber: "CHK001234",
      status: "completed",
      notes: "Check #1234 received and cleared",
    });
    paymentRecords.push(payment2);
    console.log("✓ Created payment 2: XYZ Transport - ₹150,000");

    // Payment 3: Delta Carriers - 120,000 on June 25
    const payment3 = await Payment.create({
      companyId: createdCompanies[2]._id.toString(),
      companyName: createdCompanies[2].name,
      amount: 120000,
      paymentDate: new Date(2024, 5, 25),
      paymentMethod: "cash",
      description: "Cash payment received",
      referenceNumber: "CASH20240625",
      status: "completed",
      notes: "Cash counted and verified",
    });
    paymentRecords.push(payment3);
    console.log("✓ Created payment 3: Delta Carriers - ₹120,000");

    console.log("\n" + "=".repeat(60));
    console.log("📊 DEMO DATA SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log(`\n✅ Vehicles Created: ${vehicleRecords.length}`);
    console.log(`✅ Payments Created: ${paymentRecords.length}`);
    console.log(`✅ Companies Used: ${createdCompanies.length}`);

    console.log("\n📋 Sample Data Summary:");
    console.log("─".repeat(60));

    // Calculate totals for each company
    for (let i = 0; i < createdCompanies.length; i++) {
      const company = createdCompanies[i];
      const companyVehicles = vehicleRecords.filter(
        (v) => v.companyId === company._id.toString()
      );
      const totalDue = companyVehicles.reduce(
        (sum, v) => sum + parseFloat(v.priceToDriver),
        0
      );

      const payment = paymentRecords.find(
        (p) => p.companyId === company._id.toString()
      );
      const paid = payment ? payment.amount : 0;
      const balance = totalDue - paid;

      console.log(`\n${i + 1}. ${company.name}`);
      console.log(`   • Vehicles: ${companyVehicles.length}`);
      console.log(`   • Total Due: ₹${totalDue.toLocaleString("en-IN")}`);
      console.log(
        `   • Paid: ₹${paid.toLocaleString("en-IN")} ${payment ? `(${payment.paymentMethod})` : "(No payment)"}`
      );
      console.log(
        `   • Balance: ₹${balance.toLocaleString("en-IN")} ${balance > 0 ? "📈 Due" : balance < 0 ? "✓ Paid" : "✓ Settled"}`
      );
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 Ready to test! Visit the application now.\n");

    await mongoose.connection.close();
    console.log("✓ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
