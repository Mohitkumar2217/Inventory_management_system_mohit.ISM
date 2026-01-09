import User from "../models/User.js";

export const getStaffList = async (req, res) => {
  try {
    const staff = await User.find().select("-password").sort({ createdAt: -1 });

    // --- ANALYTICS LOGIC ---
    const totalStaff = staff.length;
    const activeStaff = staff.filter(s => s.status === "Active").length;
    const inactiveStaff = staff.filter(s => s.status === "Inactive").length;
    
    // Counts by Role
    const admins = staff.filter(s => s.role === "admin").length;
    const managers = staff.filter(s => s.role === "manager").length;

    // Productivity Calculation: (Active / Total) * 100
    // This represents the current operational "strength" of the team
    const productivityBase = totalStaff > 0 
      ? ((activeStaff / totalStaff) * 100).toFixed(1) 
      : 0;

    res.status(200).json({
      success: true,
      staff, // The full list for the table
      summary: {
        totalStaff,
        activeStaff,
        inactiveStaff,
        admins,
        managers,
        productivity: `${productivityBase}%`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching staff directory" });
  }
};

// Add or Update Staff member
export const syncStaffProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, status, works, password } = req.body;

        if (id) {
            // UPDATE existing staff
            const updatedUser = await User.findByIdAndUpdate(
                id, 
                { name, email, role, status, works }, 
                { new: true }
            ).select("-password");
            
            return res.status(200).json({ 
                success: true, 
                message: "Staff profile synchronized successfully", 
                member: updatedUser 
            });
        }

        // CREATE new staff
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password || "Default@123", salt);

        const newStaff = new User({
            name, email, role, status, works, password: hashedPassword
        });

        await newStaff.save();
        res.status(201).json({ success: true, message: "Staff member registered successfully" });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Staff
export const deleteStaff = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Member removed from directory" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete operation failed" });
    }
};