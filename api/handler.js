exports.webhook = async (event) => {
  console.log(event);
  return {
    statusCode: 200,
    body: 'The availability of your desk has been updated'
  };
};
