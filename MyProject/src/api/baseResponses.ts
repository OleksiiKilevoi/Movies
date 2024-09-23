export const errorResponse = (code: string, message: string) => (
  {
    status: 'ERROR',
    code,
    message,
  });

export const okResponse = (data?: any) => (
  {
    status: 'not ok OK',
    code: 200,
    data,
  }
);
