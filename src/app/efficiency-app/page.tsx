import { Card, CardHeader, CardBody, Divider, Link } from "@nextui-org/react";

export default function Page() {
  const excelList = [
    {
      name: "Excel 1",
      url: "/efficiency-app/input",
    },
    {
      name: "Excel 2",
      url: "/efficiency-app/input",
    },
    {
      name: "Excel 3",
      url: "/efficiency-app/input",
    },
    {
      name: "Excel 4",
      url: "/efficiency-app/input",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <h1>Choose Excel Page</h1>
      <Card>
        <CardBody>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {excelList.map((item, index) => {
              return (
                <Link
                  key={`${item}-${index}`}
                  href={`${item.url}`}
                  className="h-24 w-48 hover:bg-green-300 transition ease px-6 py-4 rounded-lg border flex justify-center items-center"
                >
                  <p className="text-base font-normal leading-tight">
                    {item.name}
                  </p>
                </Link>
              );
            })}
          </section>
        </CardBody>
      </Card>
    </div>
  );
}
