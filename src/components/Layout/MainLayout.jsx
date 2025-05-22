import Footer from "../Footer";
import Header from "../Header/index";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      {/* <Particles
        particleColors={["#051747", "#051747"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      /> */}
      <Footer />
    </>
  );
};

export default MainLayout;
