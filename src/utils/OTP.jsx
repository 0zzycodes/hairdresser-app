export const GenerateId = () => {
  //you can put any unique reference implementation code here
  let text = '';
  let possible = '0123456789';
  for (let i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};
