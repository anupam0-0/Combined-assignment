import Header from './components/Header';
import PetAdoptionForm from './components/PetAdoptionForm';
import "./myApp.css";

const App = () => {
  return (
    <div
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center"
      }}
    >
      <Header message={"Pet Adoption Form"} />
      <PetAdoptionForm />
    </div>
  );
};

export default App;
