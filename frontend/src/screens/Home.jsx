import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate } from 'react-router-dom'

// Mock locations for Delhi NCR autocomplete
const mockLocations = [
    "Connaught Place, New Delhi",
    "Indira Gandhi International Airport (T3), Delhi",
    "Noida Sector 62, Uttar Pradesh",
    "Gurugram Phase 3, Haryana",
    "Dwarka Sector 10, New Delhi",
    "Saket Metro Station, New Delhi",
    "Rajouri Garden, New Delhi",
    "Noida Electronic City, Uttar Pradesh"
];

// Mock drivers list
const mockDrivers = [
    { name: "Suresh Kumar", vehicle: "Maruti Suzuki Dzire", number: "DL-1RT-4928", rating: "4.8", avatar: "👨🏽‍✈️" },
    { name: "Amit Sharma", vehicle: "Hyundai Aura", number: "DL-3CA-8291", rating: "4.9", avatar: "👨🏻‍✈️" },
    { name: "Rahul Yadav", vehicle: "Tata Tigor EV", number: "HR-26-BQ-6712", rating: "4.7", avatar: "👨🏾‍✈️" }
];

const Home = () => {
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()

    // Form States
    const [pickup, setPickup] = useState('')
    const [drop, setDrop] = useState('')
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [dropSuggestions, setDropSuggestions] = useState([])

    // Booking Flow States
    // 0: Search, 1: Select Ride, 2: Matching, 3: Ride Arrived, 4: In Ride, 5: Payment/Complete
    const [rideStep, setRideStep] = useState(0) 
    const [selectedVehicle, setSelectedVehicle] = useState('sedan')
    const [matchedDriver, setMatchedDriver] = useState(null)
    const [otp, setOtp] = useState('')
    const [price, setPrice] = useState(0)
    const [eta, setEta] = useState(0)

    // Suggestion logic
    const handlePickupChange = (val) => {
        setPickup(val)
        if (val.length > 1) {
            setPickupSuggestions(mockLocations.filter(loc => loc.toLowerCase().includes(val.toLowerCase())))
        } else {
            setPickupSuggestions([])
        }
    }

    const handleDropChange = (val) => {
        setDrop(val)
        if (val.length > 1) {
            setDropSuggestions(mockLocations.filter(loc => loc.toLowerCase().includes(val.toLowerCase())))
        } else {
            setDropSuggestions([])
        }
    }

    // Auto-calculate mock price & ETA based on text length difference
    useEffect(() => {
        if (pickup && drop) {
            const dist = Math.abs(pickup.length - drop.length) + 5;
            setEta(Math.floor(dist * 1.5));
            setPrice(dist * 12);
        }
    }, [pickup, drop])

    // Find Driver simulation
    const startBooking = () => {
        setRideStep(2) // Searching screen
        setTimeout(() => {
            // Match random driver
            const randomDriver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)]
            setMatchedDriver(randomDriver)
            setOtp(Math.floor(1000 + Math.random() * 9000).toString())
            setRideStep(3) // Driver arriving
        }, 3000)
    }

    // Simulate driver arrival
    const startRide = () => {
        setRideStep(4) // In ride
        setTimeout(() => {
            setRideStep(5) // Finished
        }, 5000)
    }

    const resetBooking = () => {
        setPickup('')
        setDrop('')
        setRideStep(0)
        setMatchedDriver(null)
    }

    return (
        <main className="min-h-screen bg-dark-900 text-dark-100 flex flex-col md:flex-row relative overflow-hidden">
            
            {/* LEFT SIDEBAR: Controls & Forms */}
            <section className="w-full md:w-[450px] bg-dark-850 border-r border-dark-700/50 flex flex-col z-20 relative h-[50vh] md:h-screen shadow-nexus-lg">
                
                {/* Header */}
                <header className="p-4 border-b border-dark-700/50 flex justify-between items-center bg-dark-900/40">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nexus-500 to-teal-500 flex items-center justify-center">
                            <i className="ri-taxi-fill text-white text-lg"></i>
                        </div>
                        <h1 className="text-xl font-bold text-gradient">MyTaxi</h1>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token')
                            setUser(null)
                            navigate('/login')
                        }}
                        className="text-dark-400 hover:text-dark-200 transition-smooth text-sm p-1.5 rounded-lg hover:bg-dark-800"
                    >
                        <i className="ri-logout-box-r-line mr-1"></i> Logout
                    </button>
                </header>

                {/* FLOW CONTAINER */}
                <div className="p-5 flex-grow overflow-auto flex flex-col justify-center">
                    
                    {/* STEP 0: Search Locations */}
                    {rideStep === 0 && (
                        <div className="space-y-4 animate-fade-in-up">
                            <h2 className="text-xl font-semibold text-dark-100">Where are you going?</h2>
                            
                            {/* Pickup Input */}
                            <div className="relative">
                                <label className="block text-xs font-semibold text-nexus-400 mb-1 uppercase tracking-wider">Pickup Location</label>
                                <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5">
                                    <i className="ri-record-circle-line text-nexus-400 mr-2 text-lg"></i>
                                    <input 
                                        type="text"
                                        placeholder="Enter pickup point"
                                        value={pickup}
                                        onChange={(e) => handlePickupChange(e.target.value)}
                                        className="bg-transparent text-sm text-dark-100 outline-none w-full placeholder-dark-500"
                                    />
                                </div>
                                {pickupSuggestions.length > 0 && (
                                    <ul className="absolute top-full left-0 right-0 bg-dark-800 border border-dark-700 mt-1 rounded-xl overflow-hidden z-30 shadow-xl">
                                        {pickupSuggestions.map((s, idx) => (
                                            <li 
                                                key={idx}
                                                onClick={() => { setPickup(s); setPickupSuggestions([]); }}
                                                className="p-3 text-sm hover:bg-dark-700 cursor-pointer border-b border-dark-700/50 last:border-none"
                                            >
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Dropoff Input */}
                            <div className="relative">
                                <label className="block text-xs font-semibold text-teal-400 mb-1 uppercase tracking-wider">Destination</label>
                                <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5">
                                    <i className="ri-map-pin-2-fill text-teal-400 mr-2 text-lg"></i>
                                    <input 
                                        type="text"
                                        placeholder="Enter drop location"
                                        value={drop}
                                        onChange={(e) => handleDropChange(e.target.value)}
                                        className="bg-transparent text-sm text-dark-100 outline-none w-full placeholder-dark-500"
                                    />
                                </div>
                                {dropSuggestions.length > 0 && (
                                    <ul className="absolute top-full left-0 right-0 bg-dark-800 border border-dark-700 mt-1 rounded-xl overflow-hidden z-30 shadow-xl">
                                        {dropSuggestions.map((s, idx) => (
                                            <li 
                                                key={idx}
                                                onClick={() => { setDrop(s); setDropSuggestions([]); }}
                                                className="p-3 text-sm hover:bg-dark-700 cursor-pointer border-b border-dark-700/50 last:border-none"
                                            >
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <button
                                disabled={!pickup || !drop}
                                onClick={() => setRideStep(1)}
                                className="w-full p-3.5 rounded-xl btn-nexus text-white font-semibold text-sm tracking-wide disabled:opacity-40 disabled:pointer-events-none transition-smooth mt-6"
                            >
                                Find Cabs
                            </button>
                        </div>
                    )}

                    {/* STEP 1: Select Ride Type */}
                    {rideStep === 1 && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold text-dark-100">Select Ride Option</h2>
                                <button onClick={() => setRideStep(0)} className="text-nexus-400 text-xs font-medium hover:underline">Change Route</button>
                            </div>

                            {/* Ride Options List */}
                            <div className="space-y-2">
                                {/* Economy Bike */}
                                <div 
                                    onClick={() => setSelectedVehicle('bike')}
                                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-smooth ${selectedVehicle === 'bike' ? 'bg-nexus-500/10 border-nexus-500 shadow-nexus' : 'bg-dark-800/50 border-dark-700 hover:bg-dark-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-2xl">🏍️</div>
                                        <div>
                                            <h4 className="font-semibold text-dark-100 text-sm">Moto</h4>
                                            <p className="text-xs text-dark-400">Affordable bike rides • {eta - 3} mins</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm text-nexus-400">₹{Math.floor(price * 0.5)}</span>
                                </div>

                                {/* Sedan */}
                                <div 
                                    onClick={() => setSelectedVehicle('sedan')}
                                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-smooth ${selectedVehicle === 'sedan' ? 'bg-nexus-500/10 border-nexus-500 shadow-nexus' : 'bg-dark-800/50 border-dark-700 hover:bg-dark-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-nexus-500/10 flex items-center justify-center text-2xl">🚗</div>
                                        <div>
                                            <h4 className="font-semibold text-dark-100 text-sm">Go Sedan</h4>
                                            <p className="text-xs text-dark-400">Comfortable hatchback/sedan • {eta} mins</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm text-nexus-400">₹{price}</span>
                                </div>

                                {/* Premium SUV */}
                                <div 
                                    onClick={() => setSelectedVehicle('suv')}
                                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-smooth ${selectedVehicle === 'suv' ? 'bg-nexus-500/10 border-nexus-500 shadow-nexus' : 'bg-dark-800/50 border-dark-700 hover:bg-dark-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-2xl">🚙</div>
                                        <div>
                                            <h4 className="font-semibold text-dark-100 text-sm">Premium SUV</h4>
                                            <p className="text-xs text-dark-400">Luxury SUV for families • {eta + 2} mins</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm text-nexus-400">₹{Math.floor(price * 1.6)}</span>
                                </div>
                            </div>

                            <button
                                onClick={startBooking}
                                className="w-full p-3.5 rounded-xl btn-nexus text-white font-semibold text-sm tracking-wide mt-4"
                            >
                                Book MyTaxi
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Radar Search Animation */}
                    {rideStep === 2 && (
                        <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in-up py-6">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-nexus-500/20 rounded-full animate-ping"></div>
                                <div className="absolute w-20 h-20 bg-nexus-500/40 rounded-full animate-pulse"></div>
                                <div className="w-12 h-12 bg-nexus-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-nexus">
                                    <i className="ri-radar-line animate-spin"></i>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-dark-100">Finding Near Cab Drivers</h3>
                                <p className="text-xs text-dark-400 mt-1">Requesting rides from nearby cabs...</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Driver Matched / Arriving */}
                    {rideStep === 3 && matchedDriver && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div className="p-3 bg-nexus-500/10 border border-nexus-500/30 rounded-xl flex justify-between items-center">
                                <span className="text-xs text-nexus-300 font-semibold uppercase tracking-wider">Driver is Arriving</span>
                                <span className="text-xs bg-dark-850 px-2.5 py-1 rounded-md text-dark-100 font-bold">OTP: {otp}</span>
                            </div>

                            {/* Driver Profile */}
                            <div className="glass p-4 rounded-xl flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full bg-dark-800 flex items-center justify-center text-3xl shadow-md border border-dark-700">
                                    {matchedDriver.avatar}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-1.5">
                                        <h4 className="font-bold text-dark-100 text-sm">{matchedDriver.name}</h4>
                                        <span className="text-xs text-yellow-400 font-semibold">★ {matchedDriver.rating}</span>
                                    </div>
                                    <p className="text-xs text-dark-300 mt-0.5">{matchedDriver.vehicle}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-dark-800 text-[10px] font-bold text-nexus-400 rounded border border-dark-700 uppercase tracking-wide">
                                        {matchedDriver.number}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={startRide}
                                className="w-full p-3.5 rounded-xl btn-nexus text-white font-semibold text-sm tracking-wide mt-4"
                            >
                                Start Simulated Ride
                            </button>
                        </div>
                    )}

                    {/* STEP 4: Ride In Progress */}
                    {rideStep === 4 && (
                        <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in-up py-6">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 border-2 border-dashed border-teal-500/50 rounded-full animate-spin"></div>
                                <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-nexus">
                                    <i className="ri-roadster-fill"></i>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-dark-100">Heading to your destination</h3>
                                <p className="text-xs text-dark-400 mt-1">Driving along selected route • Arriving soon...</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Ride Completed */}
                    {rideStep === 5 && (
                        <div className="space-y-4 animate-fade-in-up text-center">
                            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-3xl text-emerald-400 mx-auto mb-2 animate-bounce">
                                <i className="ri-checkbox-circle-fill"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-dark-100">Ride Completed Successfully</h3>
                                <p className="text-xs text-dark-400 mt-1">Hope you had a comfortable trip!</p>
                            </div>

                            <div className="glass p-4 rounded-xl space-y-2 text-left text-sm max-w-xs mx-auto">
                                <div className="flex justify-between text-dark-300">
                                    <span>Total Fare:</span>
                                    <span className="font-bold text-dark-100">₹{selectedVehicle === 'bike' ? Math.floor(price * 0.5) : selectedVehicle === 'suv' ? Math.floor(price * 1.6) : price}</span>
                                </div>
                                <div className="flex justify-between text-dark-300">
                                    <span>Payment Mode:</span>
                                    <span className="font-semibold text-nexus-400">Cash / Online Wallet</span>
                                </div>
                            </div>

                            <button
                                onClick={resetBooking}
                                className="w-full p-3.5 rounded-xl btn-nexus text-white font-semibold text-sm tracking-wide mt-4"
                            >
                                Book Another Ride
                            </button>
                        </div>
                    )}

                </div>
            </section>

            {/* RIGHT MAP PANEL: Interactive Styled SVG map */}
            <section className="flex-grow h-[50vh] md:h-screen relative bg-dark-900 flex items-center justify-center p-4">
                
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

                {/* Animated Mock Map Canvas */}
                <div className="w-full max-w-3xl aspect-[16/9] border border-dark-700/60 rounded-3xl bg-dark-950 overflow-hidden relative shadow-2xl flex items-center justify-center">
                    
                    {/* SVG Map Lines & City roads */}
                    <svg className="w-full h-full absolute inset-0 opacity-40" viewBox="0 0 800 450">
                        {/* River / Blue Area */}
                        <path d="M 0,380 Q 200,320 400,390 T 800,360 L 800,450 L 0,450 Z" fill="#0f766e" opacity="0.2"/>
                        
                        {/* Roads */}
                        <path d="M 100,0 L 100,450" stroke="#374151" strokeWidth="20" strokeLinecap="round" />
                        <path d="M 400,0 Q 450,225 400,450" stroke="#374151" strokeWidth="16" strokeLinecap="round" />
                        <path d="M 700,0 L 700,450" stroke="#374151" strokeWidth="18" strokeLinecap="round" />
                        
                        <path d="M 0,100 L 800,100" stroke="#374151" strokeWidth="18" strokeLinecap="round" />
                        <path d="M 0,300 Q 400,250 800,300" stroke="#374151" strokeWidth="22" strokeLinecap="round" />
                        
                        {/* Road divider dashed lines */}
                        <path d="M 100,0 L 100,450" stroke="#4b5563" strokeWidth="1" strokeDasharray="8,8" />
                        <path d="M 700,0 L 700,450" stroke="#4b5563" strokeWidth="1" strokeDasharray="8,8" />
                        <path d="M 0,100 L 800,100" stroke="#4b5563" strokeWidth="1" strokeDasharray="8,8" />
                    </svg>

                    {/* Dynamic Pins based on state */}
                    {pickup && (
                        <div className="absolute top-[25%] left-[28%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-fade-in-up">
                            <span className="bg-nexus-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-1">
                                Pickup Point
                            </span>
                            <div className="w-5 h-5 rounded-full bg-nexus-500 border-2 border-white flex items-center justify-center shadow-lg relative">
                                <span className="absolute w-full h-full bg-nexus-500 rounded-full animate-ping opacity-60"></span>
                            </div>
                        </div>
                    )}

                    {drop && (
                        <div className="absolute top-[67%] left-[62%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-fade-in-up">
                            <span className="bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-1">
                                Destination
                            </span>
                            <div className="w-5 h-5 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center shadow-lg relative">
                                <span className="absolute w-full h-full bg-teal-500 rounded-full animate-ping opacity-60"></span>
                            </div>
                        </div>
                    )}

                    {/* Animated Route Line during booking select & booking steps */}
                    {pickup && drop && rideStep >= 1 && (
                        <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 800 450">
                            {/* Glowing Route path */}
                            <path 
                                d="M 224,112 L 500,300" 
                                fill="none" 
                                stroke="#10b981" 
                                strokeWidth="6" 
                                strokeLinecap="round" 
                                strokeDasharray="10,10"
                                className="animate-pulse"
                            />
                        </svg>
                    )}

                    {/* Simulated Cab/Car on Map */}
                    <div className={`absolute transition-all duration-[5000ms] ease-linear flex items-center justify-center
                        ${rideStep <= 2 ? 'top-[20%] left-[20%]' : ''}
                        ${rideStep === 3 ? 'top-[25%] left-[28%] scale-110' : ''}
                        ${rideStep === 4 ? 'top-[46%] left-[45%]' : ''}
                        ${rideStep >= 5 ? 'top-[67%] left-[62%]' : ''}
                    `}>
                        <div className="relative">
                            <div className="absolute -inset-2 bg-nexus-500/20 rounded-full blur animate-pulse"></div>
                            <div className="w-8 h-8 rounded-lg bg-dark-800 border border-nexus-400 flex items-center justify-center text-xl shadow-nexus relative z-10 animate-bounce">
                                🚕
                            </div>
                        </div>
                    </div>

                    {/* Default Center Status Indicator overlay */}
                    {rideStep === 0 && (
                        <div className="glass p-4 rounded-2xl max-w-xs text-center border border-dark-700 relative z-10 backdrop-blur-md">
                            <i className="ri-gps-fill text-nexus-400 text-3xl mb-2 block animate-pulse"></i>
                            <h4 className="font-semibold text-dark-100 text-sm">Interactive GPS Simulation</h4>
                            <p className="text-xs text-dark-400 mt-1">Enter your pickup and destination locations to view dynamic map routes</p>
                        </div>
                    )}
                </div>

            </section>

        </main>
    )
}

export default Home