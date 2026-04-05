const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getDashboardSummary = async (req, res) => {
  try {
    const [incomeResult, expenseResult, categoryBreakdown] = await Promise.all([
      // Calculate Total Income
      prisma.financialRecord.aggregate({
        _sum: { amount: true }, // adding all the values under column "amount"
        where: { isDeleted: false, type: "INCOME" },
      }),

      // Calculate Total Expenses
      prisma.financialRecord.aggregate({
        _sum: { amount: true },
        where: { isDeleted: false, type: "EXPENSE" },
      }),

      // Group totals by Category
      prisma.financialRecord.groupBy({
        by: ["category", "type"],
        _sum: { amount: true },
        where: { isDeleted: false },
      }),
    ]);

    // Extract the sums (Prisma returns null if there are no records, so we fallback to 0)
    const totalIncome = incomeResult._sum.amount || 0;
    const totalExpenses = expenseResult._sum.amount || 0;
    const netBalance = totalIncome - totalExpenses;

    res.status(200).json({
      status: "success",
      data: {
        overview: {
          totalIncome,
          totalExpenses,
          netBalance,
        },
        categoryBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { getDashboardSummary };
