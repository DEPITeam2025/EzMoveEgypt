import React from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Search,
  Map,
  Heart,
  Clock,
  DollarSign,
  Zap,
  Shield,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// --- Mock API Data Functions ---
const fetchFeatures = async () => [
  {
    id: 1,
    icon: "MapPin",
    title: "Find Routes",
    description:
      "Discover the best routes between any two locations with multiple transport options.",
    linkText: "Get Started →",
    link: "/findroutes",
  },
  {
    id: 2,
    icon: "Search",
    title: "Search Transport",
    description:
      "Look up specific transport lines, schedules, and real-time arrival information.",
    color: "bg-purple",
    linkText: "Get Started →",
    link: "/searchfortransport",
  },
  {
    id: 3,
    icon: "Map",
    title: "Metro Guide",
    description:
      "Complete metro network map with all lines, stations, and operating hours.",
    color: "bg-red",
    linkText: "Get Started →",
    link: "/metroguide",
  },
  {
    id: 4,
    icon: "Heart",
    title: "Saved List",
    description:
      "Save your favorite routes and transport lines for quick access.",
    color: "bg-pink",
    linkText: "Sign In to Access",
    link: "/saveditems",
    disabled: true,
  },
];

const fetchBenefits = async () => [
  {
    id: 1,
    icon: "Clock",
    title: "Save Time",
    description: "Find the fastest routes with real-time updates",
  },
  {
    id: 2,
    icon: "DollarSign",
    title: "Save Money",
    description: "Compare costs and choose the most economical option",
  },
  {
    id: 3,
    icon: "Zap",
    title: "Easy to Use",
    description: "Simple, intuitive interface for everyone",
  },
  {
    id: 4,
    icon: "Shield",
    title: "Reliable",
    description: "Accurate, up-to-date transit information",
  },
];

// --- Icon Mapping ---
const iconMap = { MapPin, Search, Map, Heart, Clock, DollarSign, Zap, Shield };

// --- Hero Section ---
function HeroSection({ onFindRoutes, onLogin }) {
  return (
    <section className={styles["hero-section"]}>
      <div className={styles["hero-container"]}>
        <h1 className={styles["hero-title"]}>Welcome to Ezmove</h1>
        <p className={styles["hero-subtitle"]}>
          Your smart companion for public transportation
        </p>
        <p className={styles["hero-description"]}>
          Navigate the city with ease. Find routes, check schedules, and plan
          your journey across buses, metro, and more.
        </p>

        <div className={styles["hero-buttons"]}>
          <button
            className={`${styles.btn} ${styles["btn-primary"]}`}
            onClick={onFindRoutes}
          >
            <span className={styles["btn-content"]}>
              Find Routes Now{" "}
              <ArrowRight size={18} style={{ marginLeft: "8px" }} />
            </span>
          </button>
          <button
            className={`${styles.btn} ${styles["btn-secondary"]}`}
            onClick={onLogin}
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
}

// --- Features Section ---
function FeaturesSection() {
  const {
    data: features,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["features"],
    queryFn: fetchFeatures,
  });

  if (isLoading) return <p>Loading features...</p>;
  if (error) return <p>Error loading features</p>;

  return (
    <section className={styles["features-section"]}>
      <div className={styles["features-container"]}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>Features</h2>
          <p className={styles["section-subtitle"]}>
            Everything you need for seamless public transportation
          </p>
        </div>

        <div className={styles["features-grid"]}>
          {features.map((feature) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div key={feature.id} className={styles["feature-card"]}>
                <div
                  className={`${styles["feature-icon"]} ${
                    styles[feature.color]
                  }`}
                >
                  <IconComponent size={24} />
                </div>
                <h3 className={styles["feature-title"]}>{feature.title}</h3>
                <p className={styles["feature-description"]}>
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className={`${styles["feature-link"]} ${
                    feature.disabled ? styles.disabled : ""
                  }`}
                >
                  {feature.linkText}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- Why Choose Us Section ---
function WhyChooseUsSection() {
  const {
    data: benefits,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["benefits"],
    queryFn: fetchBenefits,
  });

  if (isLoading) return <p>Loading benefits...</p>;
  if (error) return <p>Error loading benefits</p>;

  return (
    <section className={styles["why-choose-section"]}>
      <div className={styles["why-choose-container"]}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>Why Choose Ezmove?</h2>
          <p className={styles["section-subtitle"]}>
            Making public transportation easier for everyone
          </p>
        </div>

        <div className={styles["benefits-grid"]}>
          {benefits.map((benefit) => {
            const IconComponent = iconMap[benefit.icon];
            return (
              <div key={benefit.id} className={styles["benefit-card"]}>
                <div className={styles["benefit-icon"]}>
                  <IconComponent size={32} />
                </div>
                <h3 className={styles["benefit-title"]}>{benefit.title}</h3>
                <p className={styles["benefit-description"]}>
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- CTA Section ---
function CTASection({ onFindRoutes, onMetroGuide }) {
  return (
    <section className={styles["cta-section"]}>
      <div className={styles["cta-container"]}>
        <h2 className={styles["section-title"]}>
          Ready to Start Your Journey?
        </h2>
        <p className={styles["section-subtitle"]}>
          Join thousands of commuters who trust Ezmove for their daily travels
        </p>

        <div className={styles["cta-buttons"]}>
          <button
            className={`${styles.btn} ${styles["btn-primary"]}`}
            onClick={onFindRoutes}
          >
            <span className={styles["btn-content"]}>
              <MapPin size={18} style={{ marginRight: "8px" }} /> Find Your
              Route
            </span>
          </button>
          <button
            className={`${styles.btn} ${styles["btn-outline"]}`}
            onClick={onMetroGuide}
          >
            <span className={styles["btn-content"]}>
              <Map size={18} style={{ marginRight: "8px" }} /> View Metro Guide
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

// --- Main Home Component ---
export default function Home() {
  const navigate = useNavigate();

  const handleFindRoutes = () => navigate("/findroutes");
  const handleMetroGuide = () => navigate("/metroguide");
  const handleLogin = () => navigate("/auth/login");

  return (
    <div className={styles.home}>
      <main className={styles["main-content"]}>
        <HeroSection onFindRoutes={handleFindRoutes} onLogin={handleLogin} />
        <FeaturesSection />
        <WhyChooseUsSection />
        <CTASection
          onFindRoutes={handleFindRoutes}
          onMetroGuide={handleMetroGuide}
        />
      </main>
    </div>
  );
}
