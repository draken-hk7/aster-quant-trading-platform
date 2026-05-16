from app.services.analytics import AnalyticsService
from app.services.backtest import BacktestService
from app.services.execution import ExecutionEngine
from app.services.market_data import MarketDataService
from app.services.portfolio import PortfolioService
from app.services.risk import RiskEngine
from app.services.strategy import StrategyEngine

market_data = MarketDataService()
portfolio = PortfolioService()
risk = RiskEngine()
execution = ExecutionEngine(risk=risk, portfolio=portfolio)
strategy = StrategyEngine()
backtest = BacktestService()
analytics = AnalyticsService()

