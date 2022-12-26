// Should be always used to save progress on subconceptInstance
// In order to guarantee that if the value gets somehow manipulated, it will always get back to normal
const validations = {
  subconceptInstance: {
    progress: (previousAdvancements = [], newPercentage = 0) => {
      const progress =
        previousAdvancements.reduce((sum, { percentageAdvanced }) => sum + percentageAdvanced, 0) +
        newPercentage;

      if (progress > 100) throw new Error('Progress should be kept under 100');

      return progress;
    },
  },
};

export default validations;
