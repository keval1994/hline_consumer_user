import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiPhone,
} from "react-icons/hi";
import { countryAPI, registerCustomer, stateAPI } from "../../utils/apiService";
import { Illustration } from "../../utils";
import ArtBlobLoader from "../../common/Loader/ArtBlobLoader ";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    EmailId: "",
    MobileNo: "",
    Password: "",
    BillingAddressLine1: "",
    BillingAddressLine2: "",
    Billing_City: "",
    Billing_State_Id: "",
    Billing_Country_Id: "",
    Billing_Pincode: "",
    CreatedBy: 1,
  });

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/signup");
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [countryData, stateData] = await Promise.all([
        countryAPI.getAll(),
        stateAPI.getAll(),
      ]);
      setCountries(countryData);
      setStates(stateData);
    } catch (err) {
      console.error("Error fetching countries or states:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newCustomer = await registerCustomer(formData);
      sessionStorage.setItem("customerId", newCustomer.customerId);
      navigate("/signin");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { name: "FirstName", label: "First Name", icon: <HiOutlineUser /> },
    { name: "LastName", label: "Last Name", icon: <HiOutlineUser /> },
    { name: "EmailId", label: "Email", type: "email", icon: <HiOutlineMail /> },
    {
      name: "Password",
      label: "Password",
      type: "password",
      icon: <HiOutlineLockClosed />,
    },
    { name: "MobileNo", label: "Mobile No", type: "tel", icon: <HiPhone /> },
    { name: "BillingAddressLine1", label: "Billing Address Line 1" },
    { name: "BillingAddressLine2", label: "Billing Address Line 2" },
    { name: "Billing_City", label: "Billing City" },
    {
      name: "Billing_State_Id",
      label: "Billing State",
      render: (
        <select
          name="Billing_State_Id"
          value={formData.Billing_State_Id}
          onChange={handleChange}
          className="w-full outline-none text-sm"
          required
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.state_Id} value={state.state_Id}>
              {state.state_Name}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: "Billing_Country_Id",
      label: "Billing Country",
      render: (
        <select
          name="Billing_Country_Id"
          value={formData.Billing_Country_Id}
          onChange={handleChange}
          className="w-full outline-none text-sm"
          required
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: "Billing_Pincode",
      label: "Billing Pincode",
      type: "text",
    },
  ];

  if (loading) return <ArtBlobLoader />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-8 ">
      <div className="flex w-full max-w-6xl bg-soft rounded-xl shadow-lg overflow-hidden p-6">
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-10 bg-white rounded-xl">
          <img
            src={Illustration}
            alt="Shopping illustration"
            className="w-full max-w-md object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 bg-soft p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create Account
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[...formFields].map((field) => (
              <div key={field.name} className="col-span-1">
                <label className="block mb-1 text-sm font-semibold ">
                  {field.label}
                </label>
                <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                  {field.icon && (
                    <span className="text-gray-400 mr-2">{field.icon}</span>
                  )}
                  {field.render ? (
                    field.render
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full outline-none text-sm"
                      placeholder={field.label}
                      required
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-accent text-white font-semibold rounded-lg shadow transition"
              >
                Sign Up
              </button>
              {error && (
                <p className="text-red-500 text-center mt-2 text-sm">{error}</p>
              )}
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-primary font-medium hover:underline"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
