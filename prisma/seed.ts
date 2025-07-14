import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { GadgetService } from "../src/services/gadgetService";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@imf.gov" },
    update: {},
    create: {
      email: "admin@imf.gov",
      password: adminPassword,
      role: "admin",
    },
  });

  // Create agent user
  const agentPassword = await bcrypt.hash("agent123", 12);
  const agent = await prisma.user.upsert({
    where: { email: "agent@imf.gov" },
    update: {},
    create: {
      email: "agent@imf.gov",
      password: agentPassword,
      role: "agent",
    },
  });

  console.log("👤 Created users:", { admin: admin.email, agent: agent.email });

  // Create sample gadgets
  const gadgets = [
    {
      name: "Facial Recognition Scanner",
      codename: GadgetService.generateCodename(),
      description: "Advanced biometric scanner with quantum encryption",
      status: "Available" as const,
      missionSuccessProbability:
        GadgetService.generateMissionSuccessProbability(),
    },
    {
      name: "Stealth Communication Device",
      codename: GadgetService.generateCodename(),
      description: "Encrypted communication with satellite uplink",
      status: "Deployed" as const,
      missionSuccessProbability:
        GadgetService.generateMissionSuccessProbability(),
    },
    {
      name: "Electromagnetic Pulse Generator",
      codename: GadgetService.generateCodename(),
      description: "Portable EMP device for disabling electronics",
      status: "Available" as const,
      missionSuccessProbability:
        GadgetService.generateMissionSuccessProbability(),
    },
    {
      name: "Holographic Projector",
      codename: GadgetService.generateCodename(),
      description: "Creates realistic 3D holograms for distraction",
      status: "Available" as const,
      missionSuccessProbability:
        GadgetService.generateMissionSuccessProbability(),
    },
    {
      name: "Nano Surveillance Drone",
      codename: GadgetService.generateCodename(),
      description: "Microscopic drone with live video feed",
      status: "Deployed" as const,
      missionSuccessProbability:
        GadgetService.generateMissionSuccessProbability(),
    },
  ];

  for (const gadgetData of gadgets) {
    const gadget = await prisma.gadget.upsert({
      where: { codename: gadgetData.codename },
      update: {},
      create: gadgetData,
    });
    console.log(`🔧 Created gadget: ${gadget.codename} (${gadget.name})`);
  }

  console.log("✅ Database seeded successfully!");
  console.log("\n🔐 Test Credentials:");
  console.log("Admin: admin@imf.gov / admin123");
  console.log("Agent: agent@imf.gov / agent123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
