const main = async () => {
  console.log("Running  auth all seeders...");
  await import("./role").then(async (module) => await module.role());
  await import("./super_admin").then(async (module) => await module.super_admin());
  console.log("All auth seeders completed.");
};

main()
  .catch((err) => {
    console.error("Error seeding admin user:", err);
  })
  .finally(() => {
    console.log(" seed file finished");
    process.exit(0);
  });
