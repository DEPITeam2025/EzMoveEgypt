import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Search, Map, Heart, Clock, DollarSign, Zap, Shield } from 'lucide-react';

// Hero Section Component
function HeroSection({ onFindRoutes }) {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <h1 className="hero-title">Welcome to Ezmove</h1>
        <p className="hero-subtitle">Your smart companion for public transportation</p>
        <p className="hero-description">
          Navigate the city with ease. Find routes, check schedules, and plan your journey across buses, metro, and more.
        </p>

        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={onFindRoutes}>
            <span className="btn-content">
              Find Routes Now
              <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </span>
          </button>
          <button className="btn btn-secondary">Login</button>
        </div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      id: 1,
      icon: MapPin,
      title: "Find Routes",
      description: "Discover the best routes between any two locations with multiple transport options.",
      color: "bg-blue",
      link: "Get Started →",
    },
    {
      id: 2,
      icon: Search,
      title: "Search Transport",
      description: "Look up specific transport lines, schedules, and real-time arrival information.",
      color: "bg-purple",
      link: "Get Started →",
    },
    {
      id: 3,
      icon: Map,
      title: "Metro Guide",
      description: "Complete metro network map with all lines, stations, and operating hours.",
      color: "bg-red",
      link: "Get Started →",
    },
    {
      id: 4,
      icon: Heart,
      title: "Saved List",
      description: "Save your favorite routes and transport lines for quick access.",
      color: "bg-pink",
      link: "Sign In to Access",
      disabled: true,
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">Everything you need for seamless public transportation</p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="feature-card">
                <div className={`feature-icon ${feature.color}`}>
                  <IconComponent size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <a
                  href="#"
                  className={`feature-link ${feature.disabled ? 'disabled' : ''}`}
                >
                  {feature.link}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Why Choose Us Section Component
function WhyChooseUsSection() {
  const benefits = [
    {
      id: 1,
      icon: Clock,
      title: "Save Time",
      description: "Find the fastest routes with real-time updates",
    },
    {
      id: 2,
      icon: DollarSign,
      title: "Save Money",
      description: "Compare costs and choose the most economical option",
    },
    {
      id: 3,
      icon: Zap,
      title: "Easy to Use",
      description: "Simple, intuitive interface for everyone",
    },
    {
      id: 4,
      icon: Shield,
      title: "Reliable",
      description: "Accurate, up-to-date transit information",
    },
  ];

  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Ezmove?</h2>
          <p className="section-subtitle">Making public transportation easier for everyone</p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div key={benefit.id} className="benefit-card">
                <div className="benefit-icon">
                  <IconComponent size={32} />
                </div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection({ onFindRoutes }) {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="section-title">Ready to Start Your Journey?</h2>
        <p className="section-subtitle">Join thousands of commuters who trust Ezmove for their daily travels</p>

        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={onFindRoutes}>
            <span className="btn-content">
              <MapPin size={18} style={{ marginRight: '8px' }} />
              Find Your Route
            </span>
          </button>
          <button className="btn btn-outline">
            <span className="btn-content">
              <Map size={18} style={{ marginRight: '8px' }} />
              View Metro Guide
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

// Main Home Component
export default function Home() {
  const navigate = useNavigate();

  const handleFindRoutes = () => {
    navigate('/find-routes'); // ✅ يفتح صفحة findroute.jsx
  };

  return (
    <div className="home">
      <main className="main-content">
        <HeroSection onFindRoutes={handleFindRoutes} />
        <FeaturesSection />
        <WhyChooseUsSection />
        <CTASection onFindRoutes={handleFindRoutes} />
      </main>
    </div>
  );
}

