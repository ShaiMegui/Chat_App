import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password are required");
    }
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profilSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).send("Internal server error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User with the given email not found");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(401).send("Password is incorrect");
    }
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profilSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal server error");
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User with the given id not found");
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profilSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).send("Internal server error");
  }
};

export const updateProfil = async (req, res) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName) {
      return res
        .status(400)
        .send("First name, last name, and color are required!");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profilSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).send("Internal server error");
  }
};

export const updateProfilImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }

    const date = Date.now();
    const filename = `uploads/profils/${date}-${req.file.originalname}`;
    renameSync(req.file.path, filename);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: filename },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.status(500).send("Internal server error");
  }
};

export const RemoveProfilImage = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();
    return res.status(200).send("Profile Image removed successfully");

  } catch (error) {
    console.error("Error removing profile image:", error);
    return res.status(500).send("Internal server error");
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      secure: true,
      sameSite: "None",
    });
    return res.status(200).send("Logout successful");
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).send("Internal server error");
  }
};
