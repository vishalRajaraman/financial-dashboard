const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // Added 'new' here to properly initialize!

//creating a financial record (Admin only)
const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    const newRecord = await prisma.financialRecord.create({
      data: {
        amount: parseFloat(amount),
        type, //income or expense
        category,
        date: new Date(date), //converting input (date) from json String  to  type Date
        notes,
        userId: req.user.id, //
      },
    });
    res.status(201).json({ status: "success", data: newRecord });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

//filtering records (Admin & Analyst) and server side pagination
const getRecords = async (req, res) => {
  try {
    //paramaters for filtering records
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10, //number of records per page or chunk used for pagination
    } = req.query; //using req.query as get requests dont have a body

    let queryConditions = {}; //building the conditions for the filtering query

    if (type) {
      queryConditions.type = type;
    }
    if (category) {
      queryConditions.category = category;
    }

    if (startDate || endDate) {
      queryConditions.date = {};
      if (startDate) {
        queryConditions.date.gte = new Date(startDate);
      }
      if (endDate) {
        queryConditions.date.lte = new Date(endDate);
      }
    }

    // Pagination math
    const skip = (parseInt(page) - 1) * parseInt(limit); // (limit=10 constant) if page=1 skip=0 no records are skipped first 10 records are read,page=2 skip =10 first 10 records are skipped the next 10 records are read

    const [records, total] = await Promise.all([
      //prallel execution of DB queries using promise.all
      prisma.financialRecord.findMany({
        where: queryConditions,
        skip, //skipping already read records
        take: parseInt(limit),
        orderBy: { date: "desc" },
      }),
      prisma.financialRecord.count({ where: queryConditions }),
    ]);

    res.status(200).json({
      status: "success",
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit), //preventing decimal values
      },
      data: records,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

//updating a record (Admin Only)
// 3. Update a Record (Admin Only)
const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date, notes } = req.body;

    const updatedRecord = await prisma.financialRecord.update({
      where: { id }, //updating financial records using  id of the record
      data: {
        ...(amount && { amount: parseFloat(amount) }), //... helps us to achieve partial updation of the record
        ...(type && { type }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
        ...(notes && { notes }),
      },
    });

    res.status(200).json({ status: "success", data: updatedRecord });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
// Deletion of a record (Soft Delete) - Admin Only
const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await prisma.financialRecord.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Record successfully soft-deleted.",
      data: deletedRecord,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
module.exports = { createRecord, getRecords, updateRecord, deleteRecord };
