import dbConnect from "./lib/mongo/mongodb";

export async function register() {
  await dbConnect();
  console.log('>>> connected to DB from instrumentation');
}
