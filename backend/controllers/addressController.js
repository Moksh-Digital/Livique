import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Get all addresses
export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");
  res.json(user.addresses || []);
});

// Add new address
export const addAddress = asyncHandler(async (req, res) => {
  const { fullName, mobile, houseNo, street, landmark, locality, city, state, pincode, addressType } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  const newAddress = {
    fullName, mobile, houseNo, street, landmark, locality, city, state, pincode, addressType
  };

  user.addresses.push(newAddress);
  await user.save();
  res.status(201).json({ message: "Address added", addresses: user.addresses });
});

// Update address
export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  const address = user.addresses.id(id);
  if (!address) throw new Error("Address not found");

  Object.assign(address, req.body);
  await user.save();
  res.json({ message: "Address updated", addresses: user.addresses });
});

// Delete address
export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  user.addresses.id(id)?.remove();
  await user.save();
  res.json({ message: "Address deleted", addresses: user.addresses });
});

// Set default address
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  user.addresses.forEach(addr => addr.isDefault = addr._id.toString() === id);
  await user.save();
  res.json({ message: "Default address updated", addresses: user.addresses });
});
