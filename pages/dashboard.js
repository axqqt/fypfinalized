import { useState, useEffect } from "react";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Dashboard() {
  const [user, setUser] = useState({
    isLoggedIn: true,
    type: "contractor", // contractor or tradesman
    name: "John Doe",
  });
  const [activeTab, setActiveTab] = useState("fairPrice");
  const [jobs, setJobs] = useState([]); // List of jobs visible to tradesmen
  const navLinks = [
    { id: "fairPrice", name: "Fair Price Calculator", icon: "📊" },
    { id: "marketRates", name: "Market Rates", icon: "💹" },
    { id: "disputeResolution", name: "Dispute Resolution", icon: "⚖️" },
    { id: "regionalAnalysis", name: "Regional Analysis", icon: "🗺️" },
    { id: "benchmarkReport", name: "Benchmark Report", icon: "📈" },
    { id: "createJob", name: "Create Job", icon: "📋" }, // New tab for job creation
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "fairPrice":
        return <FairPriceCalculator userType={user.type} />;
      case "marketRates":
        return <MarketRatesAnalyzer userType={user.type} />;
      case "disputeResolution":
        return <DisputeResolver userType={user.type} />;
      case "regionalAnalysis":
        return <RegionalAnalysis userType={user.type} />;
      case "benchmarkReport":
        return <BenchmarkReport userType={user.type} />;
      case "createJob":
        return user.type === "contractor" ? (
          <CreateJobForm />
        ) : (
          <p className="text-gray-600 text-center">
            Only contractors can create jobs.
          </p>
        );
      default:
        return <FairPriceCalculator userType={user.type} />;
    }
  };

  // Fetch jobs for tradesmen
  useEffect(() => {
    if (user.type === "tradesman") {
      fetchJobs();
    }
  }, [user.type]);
  
  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/jobs");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch jobs");
      setJobs(data.jobs);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-50 ${geistSans.variable} ${geistMono.variable}`}
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image
              src="/next.svg"
              alt="Construction Price Analyzer"
              width={100}
              height={24}
              priority
            />
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              Construction Price Analyzer
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user.isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.name}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                  {user.type}
                </span>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white shadow-sm md:h-auto">
          <nav className="p-4">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => setActiveTab(link.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === link.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-medium">{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-grow p-4 md:p-8">
          {renderActiveComponent()}
          {user.type === "tradesman" && <JobListings jobs={jobs} />}
        </main>
      </div>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2025 Construction Price Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Fair Price Calculator Component
function FairPriceCalculator({ userType }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Fair Price Calculator</h2>
      <p className="text-gray-600">
        This tool helps {userType}s calculate fair prices for construction
        projects.
      </p>
    </div>
  );
}

// Market Rates Analyzer Component
function MarketRatesAnalyzer({ userType }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Market Rates Analyzer</h2>
      <p className="text-gray-600">
        Analyze current market rates for materials and labor based on your
        location.
      </p>
    </div>
  );
}

// Dispute Resolver Component
function DisputeResolver({ userType }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Dispute Resolution</h2>
      <p className="text-gray-600">
        Resolve disputes between contractors and tradesmen efficiently.
      </p>
    </div>
  );
}

// Regional Analysis Component
function RegionalAnalysis({ userType }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Regional Analysis</h2>
      <p className="text-gray-600">
        Get insights into regional trends and pricing for construction projects.
      </p>
    </div>
  );
}

// Benchmark Report Component
function BenchmarkReport({ userType }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Benchmark Report</h2>
      <p className="text-gray-600">
        Generate benchmark reports comparing your project costs with industry
        standards.
      </p>
    </div>
  );
}

// Create Job Form Component
function CreateJobForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    area_sqm: "",
    complexity_score: 5,
    material_quality_score: 5,
    budget: "",
    deadline: "",
    contractor_id: "12345", // Example contractor ID (can be dynamically set based on logged-in user)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["area_sqm", "budget", "complexity_score", "material_quality_score"].includes(name)
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    // const missingFields = required_fields.filter((field) => !formData[field]);
    // if (missingFields.length > 0) {
    //   setError(`The following fields are required: ${missingFields.join(", ")}`);
    //   setLoading(false);
    //   return;
    // }

    try {
      const response = await fetch("http://localhost:5000/api/create-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create job");
      alert("Job created successfully!");
      setFormData({
        title: "",
        category: "",
        location: "",
        description: "",
        area_sqm: "",
        complexity_score: 5,
        material_quality_score: 5,
        budget: "",
        deadline: "",
        contractor_id: "12345", // Reset contractor ID if needed
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Create a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Painting">Painting</option>
            <option value="Flooring">Flooring</option>
            <option value="Roofing">Roofing</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Masonry">Masonry</option>
            <option value="HVAC">HVAC</option>
            <option value="Landscaping">Landscaping</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Area (square meters) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area (square meters)</label>
          <input
            type="number"
            name="area_sqm"
            value={formData.area_sqm}
            onChange={handleInputChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Complexity Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complexity Score: {formData.complexity_score}
          </label>
          <input
            type="range"
            name="complexity_score"
            min="1"
            max="10"
            value={formData.complexity_score}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        {/* Material Quality Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material Quality: {formData.material_quality_score}
          </label>
          <input
            type="range"
            name="material_quality_score"
            min="1"
            max="10"
            value={formData.material_quality_score}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Contractor ID (hidden or pre-filled) */}
        <input type="hidden" name="contractor_id" value={formData.contractor_id} />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}
    </div>
  );
}

// Job Listings Component
function JobListings({ jobs }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-2xl font-bold mb-6">Available Jobs</h2>
      {jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <li key={index} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.description}</p>
              <div className="mt-2">
                <p className="text-sm">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-sm">
                  <strong>Budget:</strong> ${job.budget}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No jobs available at the moment.</p>
      )}
    </div>
  );
}
