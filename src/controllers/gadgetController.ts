import { Request, Response } from "express";
import { prisma } from "../app";
import { GadgetService } from "../services/gadgetService";
import { AuthenticatedRequest } from "../middleware/auth";

export const getAllGadgets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;

    const whereClause = status ? { status: status as any } : {};

    const gadgets = await prisma.gadget.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Add mission success probability to each gadget
    const gadgetsWithProbability = gadgets.map((gadget: any) => ({
      ...gadget,
      missionSuccessProbability:
        gadget.missionSuccessProbability ||
        GadgetService.generateMissionSuccessProbability(),
      probabilityText: `${gadget.codename} - ${
        gadget.missionSuccessProbability ||
        GadgetService.generateMissionSuccessProbability()
      }% success probability`,
    }));

    res.json({
      message: "Gadgets retrieved successfully",
      count: gadgetsWithProbability.length,
      gadgets: gadgetsWithProbability,
    });
  } catch (error) {
    console.error("Get gadgets error:", error);
    res.status(500).json({
      error: "Failed to retrieve gadgets",
      code: "GADGETS_FETCH_ERROR",
    });
  }
};

export const getGadgetById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const gadget = await prisma.gadget.findUnique({
      where: { id },
    });

    if (!gadget) {
      res.status(404).json({
        error: "Gadget not found",
        code: "GADGET_NOT_FOUND",
      });
      return;
    }

    const gadgetWithProbability = {
      ...gadget,
      missionSuccessProbability:
        gadget.missionSuccessProbability ||
        GadgetService.generateMissionSuccessProbability(),
      probabilityText: `${gadget.codename} - ${
        gadget.missionSuccessProbability ||
        GadgetService.generateMissionSuccessProbability()
      }% success probability`,
    };

    res.json({
      message: "Gadget retrieved successfully",
      gadget: gadgetWithProbability,
    });
  } catch (error) {
    console.error("Get gadget error:", error);
    res.status(500).json({
      error: "Failed to retrieve gadget",
      code: "GADGET_FETCH_ERROR",
    });
  }
};

export const createGadget = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        error: "Gadget name is required",
        code: "MISSING_NAME",
      });
      return;
    }

    // Generate unique codename
    let codename = GadgetService.generateCodename();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure codename is unique
    while (attempts < maxAttempts) {
      const existingGadget = await prisma.gadget.findUnique({
        where: { codename },
      });

      if (!existingGadget) break;

      codename =
        Math.random() > 0.5
          ? GadgetService.generateCodename()
          : GadgetService.generateAlternativeCodename();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      res.status(500).json({
        error: "Failed to generate unique codename",
        code: "CODENAME_GENERATION_ERROR",
      });
      return;
    }

    // Generate mission success probability
    const missionSuccessProbability =
      GadgetService.generateMissionSuccessProbability();

    // Create gadget
    const gadget = await prisma.gadget.create({
      data: {
        name,
        codename,
        description: description || GadgetService.generateDescription(codename),
        missionSuccessProbability,
        status: "Available",
      },
    });

    res.status(201).json({
      message: "Gadget created successfully",
      gadget: {
        ...gadget,
        probabilityText: `${gadget.codename} - ${gadget.missionSuccessProbability}% success probability`,
      },
    });
  } catch (error) {
    console.error("Create gadget error:", error);
    res.status(500).json({
      error: "Failed to create gadget",
      code: "GADGET_CREATE_ERROR",
    });
  }
};

export const updateGadget = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    // Check if gadget exists
    const existingGadget = await prisma.gadget.findUnique({
      where: { id },
    });

    if (!existingGadget) {
      res.status(404).json({
        error: "Gadget not found",
        code: "GADGET_NOT_FOUND",
      });
      return;
    }

    // Validate status if provided
    const validStatuses = [
      "Available",
      "Deployed",
      "Destroyed",
      "Decommissioned",
    ];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({
        error: "Invalid status",
        code: "INVALID_STATUS",
        validStatuses,
      });
      return;
    }

    // Update gadget
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Gadget updated successfully",
      gadget: {
        ...updatedGadget,
        probabilityText: `${updatedGadget.codename} - ${updatedGadget.missionSuccessProbability}% success probability`,
      },
    });
  } catch (error) {
    console.error("Update gadget error:", error);
    res.status(500).json({
      error: "Failed to update gadget",
      code: "GADGET_UPDATE_ERROR",
    });
  }
};

export const deleteGadget = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if gadget exists
    const existingGadget = await prisma.gadget.findUnique({
      where: { id },
    });

    if (!existingGadget) {
      res.status(404).json({
        error: "Gadget not found",
        code: "GADGET_NOT_FOUND",
      });
      return;
    }

    // Don't actually delete, just mark as decommissioned
    const decommissionedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: "Decommissioned",
        decommissionedAt: new Date(),
      },
    });

    res.json({
      message: "Gadget decommissioned successfully",
      gadget: {
        ...decommissionedGadget,
        probabilityText: `${decommissionedGadget.codename} - Decommissioned`,
      },
    });
  } catch (error) {
    console.error("Delete gadget error:", error);
    res.status(500).json({
      error: "Failed to decommission gadget",
      code: "GADGET_DELETE_ERROR",
    });
  }
};

export const selfDestructGadget = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;

    // Check if gadget exists
    const existingGadget = await prisma.gadget.findUnique({
      where: { id },
    });

    if (!existingGadget) {
      res.status(404).json({
        error: "Gadget not found",
        code: "GADGET_NOT_FOUND",
      });
      return;
    }

    // Check if gadget can be self-destructed
    if (!GadgetService.canSelfDestruct(existingGadget.status)) {
      res.status(400).json({
        error: "Gadget cannot be self-destructed in its current status",
        code: "INVALID_STATUS_FOR_SELF_DESTRUCT",
        currentStatus: existingGadget.status,
        allowedStatuses: ["Available", "Deployed"],
      });
      return;
    }

    // Generate confirmation code if not provided
    if (!confirmationCode) {
      const selfDestructCode = GadgetService.generateSelfDestructCode();

      // Store the code temporarily (in real system, this would be sent via secure channel)
      await prisma.gadget.update({
        where: { id },
        data: { selfDestructCode },
      });

      res.json({
        message:
          "Self-destruct sequence initiated. Confirmation code generated.",
        confirmationCode: selfDestructCode,
        warning:
          "⚠️ This is a simulated confirmation code. In a real system, this would be sent via secure channels.",
        instructions:
          "Use this confirmation code to complete the self-destruct sequence.",
      });
      return;
    }

    // Verify confirmation code
    if (existingGadget.selfDestructCode !== confirmationCode) {
      res.status(400).json({
        error: "Invalid confirmation code",
        code: "INVALID_CONFIRMATION_CODE",
      });
      return;
    }

    // Execute self-destruct
    const destroyedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: "Destroyed",
        selfDestructAt: new Date(),
        selfDestructCode: null, // Clear the code after use
      },
    });

    res.json({
      message: "💥 Self-destruct sequence completed successfully",
      gadget: {
        ...destroyedGadget,
        probabilityText: `${destroyedGadget.codename} - DESTROYED`,
      },
      timestamp: destroyedGadget.selfDestructAt,
    });
  } catch (error) {
    console.error("Self-destruct error:", error);
    res.status(500).json({
      error: "Self-destruct sequence failed",
      code: "SELF_DESTRUCT_ERROR",
    });
  }
};
