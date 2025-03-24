export const designToolPermission = (req: any) => {
  if(req.tool === 'exportComponent') {
    return req.context.user?.roles?.includes('designer');
  }
  return true;
};