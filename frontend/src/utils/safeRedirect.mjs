export const getSafeRedirect = (redirect) => {
  if (
    typeof redirect !== 'string' ||
    !redirect.startsWith('/') ||
    redirect.startsWith('//') ||
    redirect.includes('\\')
  ) {
    return '/';
  }

  return redirect;
};
