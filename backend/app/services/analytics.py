class AnalyticsService:
    def assistant(self) -> dict[str, object]:
        return {
            "regime": "risk-on with elevated single-name dispersion",
            "volatility_forecast": "moderate-to-high next 5 sessions",
            "recommendations": [
                "Reduce gross beta if VaR rises above 2.2% of NAV.",
                "Prefer pair hedges in semiconductors over index-only hedges.",
                "Throttle VWAP participation when spread widens beyond 18 bps.",
            ],
            "sentiment": [
                {"topic": "AI infrastructure", "score": 0.71},
                {"topic": "rates", "score": -0.24},
                {"topic": "crypto liquidity", "score": 0.38},
            ],
        }

