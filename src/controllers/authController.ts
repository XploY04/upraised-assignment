import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../app";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role = "agent" } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        error: "Email and password are required",
        code: "MISSING_CREDENTIALS",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        error: "Password must be at least 6 characters long",
        code: "WEAK_PASSWORD",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        error: "User with this email already exists",
        code: "USER_EXISTS",
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "agent",
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string
    );

    res.status(201).json({
      message: "Agent registered successfully",
      user,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      code: "REGISTRATION_ERROR",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        error: "Email and password are required",
        code: "MISSING_CREDENTIALS",
      });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      code: "LOGIN_ERROR",
    });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      });
      return;
    }

    res.json({
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Failed to retrieve profile",
      code: "PROFILE_ERROR",
    });
  }
};
