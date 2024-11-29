import LandingPage from "@/components/landing/LandingPage";
import RBDLogo from "../../../../public/icons/new_rbd.png";

export default function Page() {
  return (
    <main>
      <LandingPage
        title={`RBD App`}
        img={RBDLogo}
        bg={`bg-[url('/rbd-app/landing.png')]`}
        description={`Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi
              accusantium quisquam, dolores officiis quo explicabo et,
              recusandae, quidem deserunt saepe minima adipisci rerum corrupti
              quam id molestias similique maxime ea.`}
        href={`/rbd-app`}
      />
    </main>
  );
}
