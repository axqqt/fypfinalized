import { useState } from "react";
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

  const navLinks = [
    { id: "fairPrice", name: "Fair Price Calculator", icon: "📊" },
    { id: "marketRates", name: "Market Rates", icon: "💹" },
    { id: "disputeResolution", name: "Dispute Resolution", icon: "⚖️" },
    { id: "regionalAnalysis", name: "Regional Analysis", icon: "🗺️" },
    { id: "benchmarkReport", name: "Benchmark Report", icon: "📈" },
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
      default:
        return <FairPriceCalculator userType={user.type} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${geistSans.variable} ${geistMono.variable}`}>
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
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Construction Price Analyzer</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user.isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                  {user.type}
                </span>
                <button className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
              </>
            ) : (
              <>
                <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</a>
                <a href="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
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
  const [formData, setFormData] = useState({
    category: "",
    location: "",
    area_sqm: "",
    complexity_score: 5,
    material_quality_score: 5,
    user_type: userType,
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    "Painting",
    "Flooring",
    "Roofing",
    "Electrical",
    "Plumbing",
    "Carpentry",
    "Masonry",
    "HVAC",
    "Landscaping",
  ];

  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "area_sqm" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/predict-fair-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to predict fair price");
      setPrediction(data.predicted_fair_price);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Fair Price Calculator</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Calculating..." : "Calculate Fair Price"}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Price Prediction</h3>
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">{error}</div>
          )}
          {prediction !== null ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">Estimated Fair Price:</p>
              <p className="text-4xl font-bold text-blue-700">${prediction.toLocaleString()}</p>
              <div className="mt-6 text-sm text-gray-600">
                <p className="mb-2">This estimate is based on:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{formData.area_sqm} square meters</li>
                  <li>Complexity level: {formData.complexity_score}/10</li>
                  <li>Material quality: {formData.material_quality_score}/10</li>
                  <li>Location: {formData.location}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Fill out the form and click "Calculate Fair Price" to get a price prediction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Market Rates Analyzer Component
function MarketRatesAnalyzer({ userType }) {
  const [formData, setFormData] = useState({
    category: "",
    location: "",
    user_type: userType,
  });
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    "Painting",
    "Flooring",
    "Roofing",
    "Electrical",
    "Plumbing",
    "Carpentry",
    "Masonry",
    "HVAC",
    "Landscaping",
  ];

  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/get-market-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to get market rates");
      setMarketData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Market Rates Analysis</h2>
      <form onSubmit={handleSubmit} className="mb-6 max-w-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Get Market Rates"}
        </button>
      </form>
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">{error}</div>
      )}
      {marketData && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {formData.category} Market Rates in {formData.location}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Average Rate</p>
              <p className="text-2xl font-bold text-blue-700">${marketData.average_rate.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Minimum Rate</p>
              <p className="text-2xl font-bold text-green-700">${marketData.min_rate.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Maximum Rate</p>
              <p className="text-2xl font-bold text-red-700">${marketData.max_rate.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Recent Market Trends</h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="mb-2">
                <span className="font-medium">Rate Volatility:</span> {marketData.volatility}%
              </p>
              <p className="mb-2">
                <span className="font-medium">Annual Growth Rate:</span> {marketData.growth_rate}%
              </p>
              <p className="mb-2">
                <span className="font-medium">Demand Level:</span> {marketData.demand_level}
              </p>
              <p className="mb-2">
                <span className="font-medium">Supply Level:</span> {marketData.supply_level}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Dispute Resolver Component
function DisputeResolver({ userType }) {
  const [formData, setFormData] = useState({
    category: "",
    location: "",
    area_sqm: "",
    complexity_score: 5,
    material_quality_score: 5,
    contractor_price: "",
    client_expectation: "",
    user_type: userType,
  });
  const [disputeResult, setDisputeResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    "Painting",
    "Flooring",
    "Roofing",
    "Electrical",
    "Plumbing",
    "Carpentry",
    "Masonry",
    "HVAC",
    "Landscaping",
  ];

  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["area_sqm", "contractor_price", "client_expectation"].includes(name)
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/evaluate-dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to evaluate dispute");
      setDisputeResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Dispute Resolution Tool</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Price ($)</label>
                <input
                  type="number"
                  name="contractor_price"
                  value={formData.contractor_price}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Expectation ($)</label>
                <input
                  type="number"
                  name="client_expectation"
                  value={formData.client_expectation}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Evaluating..." : "Evaluate Dispute"}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Dispute Evaluation</h3>
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">{error}</div>
          )}
          {disputeResult ? (
            <div>
              <div
                className={`p-4 rounded-md mb-4 ${
                  disputeResult.fairness_assessment === "Fair"
                    ? "bg-green-50 text-green-700"
                    : disputeResult.fairness_assessment === "Somewhat Fair"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <p className="font-medium">Assessment: {disputeResult.fairness_assessment}</p>
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Price Analysis:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-500">Fair Price</p>
                    <p className="text-xl font-bold text-blue-700">${disputeResult.fair_price}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-500">Deviation</p>
                    <p
                      className={`text-xl font-bold ${
                        disputeResult.price_deviation > 10 ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {disputeResult.price_deviation}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-md border border-gray-200 mb-4">
                <p className="font-medium mb-2">Recommendation:</p>
                <p>{disputeResult.recommendation}</p>
              </div>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <p className="font-medium mb-2">Market Context:</p>
                <p>{disputeResult.market_context}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Fill out the form and click "Evaluate Dispute" to get an analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Regional Analysis Component
function RegionalAnalysis({ userType }) {
  const [formData, setFormData] = useState({
    category: "",
    area_sqm: "",
    complexity_score: 5,
    material_quality_score: 5,
    user_type: userType,
  });
  const [regionalData, setRegionalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    "Painting",
    "Flooring",
    "Roofing",
    "Electrical",
    "Plumbing",
    "Carpentry",
    "Masonry",
    "HVAC",
    "Landscaping",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "area_sqm" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/analyze-regional-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to analyze regional pricing");
      setRegionalData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Regional Pricing Analysis</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Analyze Regional Pricing"}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Regional Pricing Results</h3>
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">{error}</div>
          )}
          {regionalData ? (
            <div>
              <div className="mb-4">
                <p className="font-medium mb-2">Average Price Across Regions:</p>
                <p className="text-2xl font-bold text-blue-700">${regionalData.average_price}</p>
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Price Variations:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {Object.entries(regionalData.price_variations).map(([region, price]) => (
                    <li key={region}>
                      {region}: ${price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <p className="font-medium mb-2">Market Context:</p>
                <p>{regionalData.market_context}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Fill out the form and click "Analyze Regional Pricing" to get results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Benchmark Report Component
function BenchmarkReport({ userType }) {
  const [formData, setFormData] = useState({
    categories: [],
    area_sqm: 100,
    complexity_score: 5,
    material_quality_score: 5,
    user_type: userType,
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    "Painting",
    "Flooring",
    "Roofing",
    "Electrical",
    "Plumbing",
    "Carpentry",
    "Masonry",
    "HVAC",
    "Landscaping",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "area_sqm" ? Number(value) : value,
    });
  };

  const handleCheckboxChange = (category) => {
    const updatedCategories = formData.categories.includes(category)
      ? formData.categories.filter((cat) => cat !== category)
      : [...formData.categories, category];
    setFormData({
      ...formData,
      categories: updatedCategories,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/generate-benchmark-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate benchmark report");
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Benchmark Pricing Report</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <label key={category} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={category}
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCheckboxChange(category)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (square meters)</label>
              <input
                type="number"
                name="area_sqm"
                value={formData.area_sqm}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate Benchmark Report"}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Benchmark Pricing Results</h3>
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">{error}</div>
          )}
          {reportData ? (
            <div>
              <div className="mb-4">
                <p className="font-medium mb-2">Benchmark Prices:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {Object.entries(reportData).map(([category, price]) => (
                    <li key={category}>
                      {category}: ${price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Select categories and click "Generate Benchmark Report" to view results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}