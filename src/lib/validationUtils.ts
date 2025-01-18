export const getValidatedFiles = (
  formData: FormData,
  fieldName: string
): File[] => {
  const files = formData.getAll(fieldName) as File[];
  if (files.length === 0) {
    throw new Error('No files provided');
  }
  return files;
};
