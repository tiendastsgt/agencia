# Sistema Avanzado de Scheduling de Publicaciones con ML

## Resumen Ejecutivo

Este documento presenta la implementación práctica de un sistema avanzado de scheduling de publicaciones que integra algoritmos de Machine Learning para optimización temporal inteligente. El sistema combina predicción de horarios óptimos, scheduling multi-zona horaria, optimización por algoritmos específicos de plataforma, cola dinámica con re-priorización, y coordinación multi-plataforma para maximizar el engagement y alcance del contenido.

**Componentes Principales:**
- **ML Time Prediction Engine**: Predicción de mejores horarios usando modelos ML entrenados
- **Geo-Temporal Scheduler**: Scheduling inteligente por zona horaria y segmentación de audiencia
- **Platform Algorithm Optimizer**: Optimización específica por algoritmos de cada plataforma
- **Dynamic Queue Manager**: Sistema de cola dinámica con re-priorización automática
- **Multi-Platform Orchestrator**: Coordinación sincronizada de publicaciones cross-platform

## 1. Arquitectura General del Sistema

![Figura 1: Arquitectura del Sistema de Scheduling Inteligente](charts/intelligent_scheduling_architecture.png)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INTELLIGENT CONTENT SCHEDULING SYSTEM            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │ML Time Predictor│  │ Geo-Temporal    │  │Platform Algorithm│     │
│  │                 │  │ Scheduler       │  │ Optimizer       │     │
│  │• Pattern Learn  │  │• Timezone Mgmt  │  │• Algorithm Rules│     │
│  │• Engagement Pred│  │• Audience Seg   │  │• Timing Windows │     │
│  │• Context Analysis│  │• Local Optim   │  │• Platform Sync  │     │
│  │• Trend Detection│  │• Global Coord   │  │• Adaptive Learning│    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│           │                     │                     │             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SCHEDULING ORCHESTRATOR                  │   │
│  │                                                             │   │
│  │  • Content Priority Scoring                                 │   │
│  │  • Multi-Platform Coordination                              │   │
│  │  • Conflict Resolution                                      │   │
│  │  • Performance Feedback Loop                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│           │                     │                     │             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │Dynamic Queue    │  │ML Integration   │  │Analytics Engine │     │
│  │Manager          │  │Hub              │  │                 │     │
│  │• Smart Priority │  │• MAB Testing    │  │• Performance    │     │
│  │• Re-prioritize  │  │• RL Optimization│  │• Pattern Detect │     │
│  │• Dependency Mgmt│  │• Genetic Evol   │  │• Prediction Val │     │
│  │• Conflict Solve │  │• Reward Feedback│  │• Trend Analysis │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│           │                     │                     │             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    PLATFORM CONNECTORS                      │   │
│  │                                                             │   │
│  │  Instagram • TikTok • Twitter/X • LinkedIn • Facebook • YouTube  │
│  │  • Native APIs • Publishing Automation • Metrics Collection │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Componente 1: Predicción de Mejores Horarios usando ML

### 2.1 ML Time Prediction Engine

```python
import numpy as np
import pandas as pd
from datetime import datetime, timedelta, timezone
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import warnings
warnings.filterwarnings('ignore')

class MLTimePredictionEngine:
    """
    Sistema avanzado de predicción de mejores horarios para publicación
    usando múltiples algoritmos ML y análisis contextual
    """
    
    def __init__(self, platforms=None):
        self.platforms = platforms or ['instagram', 'tiktok', 'twitter', 'linkedin', 'facebook', 'youtube']
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.feature_columns = []
        self.initialized = False
        
    def prepare_training_data(self, historical_data):
        """
        Prepara datos históricos para entrenamiento del modelo
        
        Args:
            historical_data (pd.DataFrame): Datos históricos con columnas:
                - platform: plataforma
                - published_at: timestamp de publicación
                - engagement_score: score de engagement (0-1)
                - content_type: tipo de contenido
                - audience_segment: segmento de audiencia
                - timezone: zona horaria de publicación
                - day_of_week: día de la semana (0-6)
                - hour: hora del día (0-23)
                - is_holiday: si es día festivo
                - season: estación del año
                - competitor_activity: nivel de actividad competitiva
        
        Returns:
            tuple: (X_train, y_train, feature_names)
        """
        
        # Ingeniería de características temporales avanzada
        df = historical_data.copy()
        
        # Características temporales
        df['hour'] = pd.to_datetime(df['published_at']).dt.hour
        df['day_of_week'] = pd.to_datetime(df['published_at']).dt.dayofweek
        df['day_of_month'] = pd.to_datetime(df['published_at']).dt.day
        df['week_of_year'] = pd.to_datetime(df['published_at']).dt.isocalendar().week
        df['month'] = pd.to_datetime(df['published_at']).dt.month
        df['quarter'] = pd.to_datetime(df['published_at']).dt.quarter
        
        # Características cíclicas (importante para capturar patrones)
        df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
        df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
        df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
        df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
        df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
        
        # Características de contexto
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        df['is_morning'] = ((df['hour'] >= 6) & (df['hour'] <= 11)).astype(int)
        df['is_afternoon'] = ((df['hour'] >= 12) & (df['hour'] <= 17)).astype(int)
        df['is_evening'] = ((df['hour'] >= 18) & (df['hour'] <= 22)).astype(int)
        df['is_late_night'] = ((df['hour'] >= 23) | (df['hour'] <= 5)).astype(int)
        
        # Características de actividad histórica
        df = df.sort_values('published_at')
        df['engagement_ma_7'] = df.groupby(['platform'])['engagement_score'].rolling(7, min_periods=1).mean().values
        df['engagement_ma_30'] = df.groupby(['platform'])['engagement_score'].rolling(30, min_periods=1).mean().values
        df['posts_last_24h'] = df.groupby(['platform'])['published_at'].rolling('24h', on='published_at').count().values
        
        # Encoding de variables categóricas
        categorical_columns = ['platform', 'content_type', 'audience_segment', 'timezone', 'season']
        for col in categorical_columns:
            if col in df.columns:
                le = LabelEncoder()
                df[f'{col}_encoded'] = le.fit_transform(df[col].astype(str))
                self.encoders[col] = le
        
        # Selección de características finales
        feature_columns = [
            'hour', 'day_of_week', 'day_of_month', 'week_of_year', 'month', 'quarter',
            'hour_sin', 'hour_cos', 'day_sin', 'day_cos', 'month_sin', 'month_cos',
            'is_weekend', 'is_morning', 'is_afternoon', 'is_evening', 'is_late_night',
            'is_holiday', 'engagement_ma_7', 'engagement_ma_30', 'posts_last_24h',
            'competitor_activity'
        ]
        
        # Añadir columnas categóricas codificadas
        for col in categorical_columns:
            if f'{col}_encoded' in df.columns:
                feature_columns.append(f'{col}_encoded')
        
        self.feature_columns = [col for col in feature_columns if col in df.columns]
        
        X = df[self.feature_columns].fillna(0)
        y = df['engagement_score']
        
        return X, y, self.feature_columns
    
    def train_models(self, X_train, y_train):
        """Entrena múltiples modelos ML para predicción de engagement"""
        
        # Normalizar características
        self.scalers['main'] = StandardScaler()
        X_train_scaled = self.scalers['main'].fit_transform(X_train)
        
        # Configurar múltiples modelos
        models_config = {
            'random_forest': RandomForestRegressor(
                n_estimators=200,
                max_depth=15,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ),
            'gradient_boosting': GradientBoostingRegressor(
                n_estimators=150,
                max_depth=8,
                learning_rate=0.1,
                min_samples_split=5,
                random_state=42
            ),
            'neural_network': MLPRegressor(
                hidden_layer_sizes=(100, 50, 25),
                activation='relu',
                solver='adam',
                alpha=0.001,
                learning_rate='adaptive',
                max_iter=500,
                random_state=42
            )
        }
        
        # Entrenar modelos
        model_scores = {}
        for name, model in models_config.items():
            print(f"Entrenando modelo: {name}")
            
            if name == 'neural_network':
                model.fit(X_train_scaled, y_train)
            else:
                model.fit(X_train, y_train)
            
            # Calcular score de entrenamiento
            if name == 'neural_network':
                y_pred = model.predict(X_train_scaled)
            else:
                y_pred = model.predict(X_train)
                
            r2 = r2_score(y_train, y_pred)
            mse = mean_squared_error(y_train, y_pred)
            
            model_scores[name] = {'r2': r2, 'mse': mse}
            self.models[name] = model
            
            print(f"  R² Score: {r2:.4f}, MSE: {mse:.4f}")
        
        # Seleccionar mejor modelo como principal
        best_model = max(model_scores.keys(), key=lambda x: model_scores[x]['r2'])
        self.best_model_name = best_model
        print(f"\nMejor modelo: {best_model} (R² = {model_scores[best_model]['r2']:.4f})")
        
        self.initialized = True
        return model_scores
    
    def predict_optimal_times(self, content_params, prediction_window_hours=168):
        """
        Predice los mejores horarios para publicar contenido
        
        Args:
            content_params (dict): Parámetros del contenido
                - platform: plataforma objetivo
                - content_type: tipo de contenido
                - audience_segment: segmento de audiencia
                - timezone: zona horaria objetivo
            prediction_window_hours (int): Ventana de predicción en horas (default: 1 semana)
        
        Returns:
            list: Lista de horarios óptimos ordenados por score predicho
        """
        
        if not self.initialized:
            raise ValueError("El modelo debe ser entrenado primero")
        
        # Generar ventana de tiempo para predicción
        now = datetime.now(timezone.utc)
        time_slots = []
        
        for i in range(prediction_window_hours):
            future_time = now + timedelta(hours=i)
            time_slots.append(future_time)
        
        # Crear características para cada slot de tiempo
        prediction_data = []
        for slot_time in time_slots:
            features = self._create_time_features(slot_time, content_params)
            prediction_data.append(features)
        
        # Convertir a DataFrame
        pred_df = pd.DataFrame(prediction_data)
        
        # Asegurar que tenemos todas las columnas necesarias
        for col in self.feature_columns:
            if col not in pred_df.columns:
                pred_df[col] = 0
        
        X_pred = pred_df[self.feature_columns]
        
        # Hacer predicciones con ensemble de modelos
        predictions = {}
        for name, model in self.models.items():
            if name == 'neural_network':
                X_pred_scaled = self.scalers['main'].transform(X_pred)
                pred = model.predict(X_pred_scaled)
            else:
                pred = model.predict(X_pred)
            predictions[name] = pred
        
        # Combinar predicciones (weighted average)
        weights = {'random_forest': 0.4, 'gradient_boosting': 0.35, 'neural_network': 0.25}
        final_predictions = np.zeros(len(time_slots))
        
        for name, pred in predictions.items():
            final_predictions += weights.get(name, 0.33) * pred
        
        # Crear resultado con scores
        results = []
        for i, (slot_time, score) in enumerate(zip(time_slots, final_predictions)):
            results.append({
                'datetime': slot_time,
                'predicted_engagement': score,
                'hour': slot_time.hour,
                'day_of_week': slot_time.weekday(),
                'confidence': min(score * 1.2, 1.0)  # Ajuste de confianza
            })
        
        # Ordenar por score y devolver top slots
        results.sort(key=lambda x: x['predicted_engagement'], reverse=True)
        return results[:24]  # Top 24 horarios
    
    def _create_time_features(self, target_time, content_params):
        """Crea características temporales para un momento específico"""
        
        features = {
            'hour': target_time.hour,
            'day_of_week': target_time.weekday(),
            'day_of_month': target_time.day,
            'week_of_year': target_time.isocalendar()[1],
            'month': target_time.month,
            'quarter': (target_time.month - 1) // 3 + 1,
            'hour_sin': np.sin(2 * np.pi * target_time.hour / 24),
            'hour_cos': np.cos(2 * np.pi * target_time.hour / 24),
            'day_sin': np.sin(2 * np.pi * target_time.weekday() / 7),
            'day_cos': np.cos(2 * np.pi * target_time.weekday() / 7),
            'month_sin': np.sin(2 * np.pi * target_time.month / 12),
            'month_cos': np.cos(2 * np.pi * target_time.month / 12),
            'is_weekend': 1 if target_time.weekday() >= 5 else 0,
            'is_morning': 1 if 6 <= target_time.hour <= 11 else 0,
            'is_afternoon': 1 if 12 <= target_time.hour <= 17 else 0,
            'is_evening': 1 if 18 <= target_time.hour <= 22 else 0,
            'is_late_night': 1 if target_time.hour >= 23 or target_time.hour <= 5 else 0,
            'is_holiday': self._is_holiday(target_time),
            'competitor_activity': self._estimate_competitor_activity(target_time),
            'engagement_ma_7': 0.5,  # Valor por defecto
            'engagement_ma_30': 0.5,
            'posts_last_24h': 1
        }
        
        # Añadir características categóricas codificadas
        categorical_features = ['platform', 'content_type', 'audience_segment', 'timezone', 'season']
        for cat_feature in categorical_features:
            if cat_feature in content_params and cat_feature in self.encoders:
                try:
                    encoded_value = self.encoders[cat_feature].transform([content_params[cat_feature]])[0]
                    features[f'{cat_feature}_encoded'] = encoded_value
                except:
                    features[f'{cat_feature}_encoded'] = 0
        
        # Estación del año
        month = target_time.month
        if month in [12, 1, 2]:
            season = 'winter'
        elif month in [3, 4, 5]:
            season = 'spring'
        elif month in [6, 7, 8]:
            season = 'summer'
        else:
            season = 'fall'
            
        if 'season' in self.encoders:
            try:
                features['season_encoded'] = self.encoders['season'].transform([season])[0]
            except:
                features['season_encoded'] = 0
        
        return features
    
    def _is_holiday(self, target_time):
        """Determina si una fecha es día festivo (simplificado)"""
        # Implementación básica - en producción usar librerías como holidays
        major_holidays = [
            (1, 1),   # Año nuevo
            (7, 4),   # Día independencia USA
            (12, 25), # Navidad
        ]
        return 1 if (target_time.month, target_time.day) in major_holidays else 0
    
    def _estimate_competitor_activity(self, target_time):
        """Estima nivel de actividad competitiva (simplificado)"""
        # Horas pico generales
        if target_time.hour in [12, 13, 19, 20, 21]:
            return 0.8
        elif target_time.hour in [9, 10, 17, 18, 22]:
            return 0.6
        else:
            return 0.3
    
    def save_model(self, filepath):
        """Guarda el modelo entrenado"""
        model_data = {
            'models': self.models,
            'scalers': self.scalers,
            'encoders': self.encoders,
            'feature_columns': self.feature_columns,
            'best_model_name': self.best_model_name,
            'platforms': self.platforms
        }
        joblib.dump(model_data, filepath)
        print(f"Modelo guardado en: {filepath}")
    
    def load_model(self, filepath):
        """Carga un modelo previamente entrenado"""
        model_data = joblib.load(filepath)
        self.models = model_data['models']
        self.scalers = model_data['scalers']
        self.encoders = model_data['encoders']
        self.feature_columns = model_data['feature_columns']
        self.best_model_name = model_data['best_model_name']
        self.platforms = model_data['platforms']
        self.initialized = True
        print(f"Modelo cargado desde: {filepath}")

# Ejemplo de uso del sistema de predicción
def example_ml_time_prediction():
    """Ejemplo práctico de uso del sistema de predicción ML"""
    
    # Simular datos históricos
    np.random.seed(42)
    n_samples = 10000
    
    dates = pd.date_range('2024-01-01', periods=n_samples, freq='H')
    platforms = ['instagram', 'tiktok', 'twitter', 'linkedin']
    content_types = ['image', 'video', 'carousel', 'story']
    audiences = ['gen_z', 'millennials', 'gen_x', 'baby_boomers']
    
    historical_data = pd.DataFrame({
        'published_at': np.random.choice(dates, n_samples),
        'platform': np.random.choice(platforms, n_samples),
        'content_type': np.random.choice(content_types, n_samples),
        'audience_segment': np.random.choice(audiences, n_samples),
        'timezone': np.random.choice(['UTC', 'EST', 'PST', 'CET'], n_samples),
        'is_holiday': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
        'season': np.random.choice(['spring', 'summer', 'fall', 'winter'], n_samples),
        'competitor_activity': np.random.uniform(0.1, 0.9, n_samples)
    })
    
    # Simular engagement score basado en patrones realistas
    engagement_scores = []
    for _, row in historical_data.iterrows():
        hour = pd.to_datetime(row['published_at']).hour
        day_of_week = pd.to_datetime(row['published_at']).dayofweek
        
        # Patrones base por hora
        if hour in [12, 13, 19, 20, 21]:  # Horas pico
            base_score = 0.7
        elif hour in [9, 10, 17, 18]:  # Horas buenas
            base_score = 0.5
        else:
            base_score = 0.3
        
        # Ajuste por día de semana
        if day_of_week in [5, 6]:  # Fin de semana
            base_score *= 1.2
        
        # Ajuste por plataforma
        if row['platform'] == 'tiktok':
            base_score *= 1.1
        elif row['platform'] == 'linkedin' and hour < 9 or hour > 18:
            base_score *= 0.7
        
        # Añadir ruido
        final_score = max(0, min(1, base_score + np.random.normal(0, 0.15)))
        engagement_scores.append(final_score)
    
    historical_data['engagement_score'] = engagement_scores
    
    print("📊 Iniciando entrenamiento del modelo de predicción ML...")
    
    # Inicializar y entrenar el sistema
    predictor = MLTimePredictionEngine()
    X_train, y_train, features = predictor.prepare_training_data(historical_data)
    
    print(f"✅ Datos preparados: {len(X_train)} muestras, {len(features)} características")
    
    # Entrenar modelos
    scores = predictor.train_models(X_train, y_train)
    
    # Hacer predicción para contenido específico
    content_params = {
        'platform': 'instagram',
        'content_type': 'video',
        'audience_segment': 'millennials',
        'timezone': 'EST'
    }
    
    print("\n🎯 Prediciendo mejores horarios para publicación...")
    optimal_times = predictor.predict_optimal_times(content_params, prediction_window_hours=48)
    
    print("\n⏰ Top 10 mejores horarios predichos:")
    for i, slot in enumerate(optimal_times[:10]):
        print(f"{i+1:2d}. {slot['datetime'].strftime('%Y-%m-%d %H:%M')} - "
              f"Score: {slot['predicted_engagement']:.3f} - "
              f"Confianza: {slot['confidence']:.3f}")
    
    return predictor

# Ejecutar ejemplo si se ejecuta directamente
if __name__ == "__main__":
    predictor = example_ml_time_prediction()
```

### 2.2 Sistema de Análisis Contextual

```python
import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union
import pandas as pd
import numpy as np
from dataclasses import dataclass, asdict

@dataclass
class ContextualEvent:
    """Estructura de datos para eventos contextuales"""
    event_type: str  # 'trending_topic', 'holiday', 'news', 'weather', 'competitor'
    title: str
    description: str
    start_time: datetime
    end_time: Optional[datetime]
    impact_score: float  # 0.0 a 1.0
    platforms_affected: List[str]
    audience_segments: List[str]
    keywords: List[str]

class ContextualAnalysisEngine:
    """
    Sistema avanzado de análisis contextual para optimizar timing
    basado en eventos, tendencias, y factores externos
    """
    
    def __init__(self):
        self.event_sources = {
            'trending_topics': self._get_trending_topics,
            'holidays': self._get_holidays,
            'weather_events': self._get_weather_events,
            'competitor_activity': self._get_competitor_activity,
            'market_events': self._get_market_events
        }
        self.context_cache = {}
        self.cache_duration = timedelta(hours=1)
    
    def analyze_publishing_context(self, target_time: datetime, 
                                 platform: str, 
                                 content_type: str,
                                 audience_location: str = "US") -> Dict:
        """
        Analiza el contexto para un momento específico de publicación
        
        Args:
            target_time: Momento objetivo para publicación
            platform: Plataforma social objetivo
            content_type: Tipo de contenido
            audience_location: Ubicación principal de la audiencia
        
        Returns:
            Dict con análisis contextual completo
        """
        
        cache_key = f"{target_time.isoformat()}_{platform}_{audience_location}"
        
        # Verificar cache
        if (cache_key in self.context_cache and 
            datetime.now() - self.context_cache[cache_key]['timestamp'] < self.cache_duration):
            return self.context_cache[cache_key]['data']
        
        # Recolectar eventos contextuales
        contextual_events = []
        
        for source_name, source_func in self.event_sources.items():
            try:
                events = source_func(target_time, platform, audience_location)
                contextual_events.extend(events)
            except Exception as e:
                print(f"Error en fuente {source_name}: {e}")
        
        # Calcular impacto contextual
        context_analysis = self._calculate_context_impact(
            contextual_events, target_time, platform, content_type
        )
        
        # Cache del resultado
        self.context_cache[cache_key] = {
            'timestamp': datetime.now(),
            'data': context_analysis
        }
        
        return context_analysis
    
    def _get_trending_topics(self, target_time: datetime, 
                           platform: str, 
                           location: str) -> List[ContextualEvent]:
        """Obtiene trending topics para el momento y plataforma específica"""
        
        # Simulación - en producción conectar con APIs reales
        trending_topics = [
            {
                'title': 'Sustainable Fashion',
                'description': 'Growing trend in eco-friendly clothing',
                'impact_score': 0.7,
                'keywords': ['sustainable', 'fashion', 'eco', 'green'],
                'platforms': ['instagram', 'tiktok', 'pinterest']
            },
            {
                'title': 'AI Technology',
                'description': 'Latest developments in artificial intelligence',
                'impact_score': 0.8,
                'keywords': ['AI', 'technology', 'innovation', 'future'],
                'platforms': ['linkedin', 'twitter', 'youtube']
            },
            {
                'title': 'Health & Wellness',
                'description': 'Mental health awareness and wellness tips',
                'impact_score': 0.6,
                'keywords': ['health', 'wellness', 'mental', 'fitness'],
                'platforms': ['instagram', 'facebook', 'tiktok']
            }
        ]
        
        events = []
        for topic in trending_topics:
            if platform in topic['platforms']:
                event = ContextualEvent(
                    event_type='trending_topic',
                    title=topic['title'],
                    description=topic['description'],
                    start_time=target_time - timedelta(hours=12),
                    end_time=target_time + timedelta(hours=24),
                    impact_score=topic['impact_score'],
                    platforms_affected=[platform],
                    audience_segments=['all'],
                    keywords=topic['keywords']
                )
                events.append(event)
        
        return events
    
    def _get_holidays(self, target_time: datetime, 
                     platform: str, 
                     location: str) -> List[ContextualEvent]:
        """Identifica días festivos y eventos especiales"""
        
        # Calendarios de festivales y eventos importantes
        holidays_calendar = {
            (1, 1): {'name': 'New Year', 'impact': 0.9},
            (2, 14): {'name': 'Valentine\'s Day', 'impact': 0.8},
            (3, 17): {'name': 'St. Patrick\'s Day', 'impact': 0.6},
            (4, 1): {'name': 'April Fools', 'impact': 0.7},
            (5, 1): {'name': 'May Day', 'impact': 0.5},
            (7, 4): {'name': 'Independence Day', 'impact': 0.9},
            (10, 31): {'name': 'Halloween', 'impact': 0.8},
            (11, 4): {'name': 'Thanksgiving', 'impact': 0.9},
            (12, 25): {'name': 'Christmas', 'impact': 1.0}
        }
        
        events = []
        date_key = (target_time.month, target_time.day)
        
        if date_key in holidays_calendar:
            holiday = holidays_calendar[date_key]
            event = ContextualEvent(
                event_type='holiday',
                title=holiday['name'],
                description=f"Major holiday: {holiday['name']}",
                start_time=target_time.replace(hour=0, minute=0),
                end_time=target_time.replace(hour=23, minute=59),
                impact_score=holiday['impact'],
                platforms_affected=['all'],
                audience_segments=['all'],
                keywords=[holiday['name'].lower(), 'holiday', 'celebration']
            )
            events.append(event)
        
        return events
    
    def _get_weather_events(self, target_time: datetime, 
                          platform: str, 
                          location: str) -> List[ContextualEvent]:
        """Analiza eventos meteorológicos que pueden afectar engagement"""
        
        # Simulación de datos meteorológicos
        # En producción integrar con APIs como OpenWeatherMap
        weather_events = []
        
        # Simular evento meteorológico severo ocasional
        if np.random.random() < 0.1:  # 10% probabilidad
            event = ContextualEvent(
                event_type='weather_event',
                title='Severe Weather Alert',
                description='Extreme weather conditions affecting user activity',
                start_time=target_time - timedelta(hours=2),
                end_time=target_time + timedelta(hours=6),
                impact_score=0.4,  # Reduce engagement
                platforms_affected=['all'],
                audience_segments=['local'],
                keywords=['weather', 'storm', 'safety']
            )
            weather_events.append(event)
        
        return weather_events
    
    def _get_competitor_activity(self, target_time: datetime, 
                               platform: str, 
                               location: str) -> List[ContextualEvent]:
        """Estima actividad de competidores"""
        
        # Simulación de patrones de actividad competitiva
        hour = target_time.hour
        day_of_week = target_time.weekday()
        
        # Horas de mayor actividad competitiva
        high_activity_hours = [9, 12, 13, 17, 19, 20, 21]
        
        if hour in high_activity_hours:
            impact_score = 0.8 if day_of_week < 5 else 0.6
            event = ContextualEvent(
                event_type='competitor_activity',
                title='High Competitor Activity',
                description='Peak posting time for competitors',
                start_time=target_time - timedelta(minutes=30),
                end_time=target_time + timedelta(minutes=30),
                impact_score=impact_score,
                platforms_affected=[platform],
                audience_segments=['all'],
                keywords=['competition', 'peak_hours']
            )
            return [event]
        
        return []
    
    def _get_market_events(self, target_time: datetime, 
                         platform: str, 
                         location: str) -> List[ContextualEvent]:
        """Identifica eventos de mercado relevantes"""
        
        events = []
        
        # Simular eventos de mercado ocasionales
        if target_time.weekday() < 5 and target_time.hour in [9, 16]:  # Horarios de mercado
            if np.random.random() < 0.15:  # 15% probabilidad
                event = ContextualEvent(
                    event_type='market_event',
                    title='Market Movement',
                    description='Significant market activity detected',
                    start_time=target_time,
                    end_time=target_time + timedelta(hours=4),
                    impact_score=0.6,
                    platforms_affected=['linkedin', 'twitter'],
                    audience_segments=['business', 'finance'],
                    keywords=['market', 'finance', 'business']
                )
                events.append(event)
        
        return events
    
    def _calculate_context_impact(self, events: List[ContextualEvent], 
                                target_time: datetime,
                                platform: str,
                                content_type: str) -> Dict:
        """Calcula el impacto contextual total en el engagement"""
        
        if not events:
            return {
                'overall_impact': 1.0,
                'impact_factors': [],
                'recommendations': ['No significant contextual events detected'],
                'optimal_adjustment': 0.0,
                'context_score': 0.5
            }
        
        # Filtrar eventos relevantes
        relevant_events = [
            event for event in events 
            if platform in event.platforms_affected or 'all' in event.platforms_affected
        ]
        
        if not relevant_events:
            return {
                'overall_impact': 1.0,
                'impact_factors': [],
                'recommendations': ['No platform-relevant contextual events'],
                'optimal_adjustment': 0.0,
                'context_score': 0.5
            }
        
        # Calcular impacto combinado
        positive_impact = 0.0
        negative_impact = 0.0
        impact_factors = []
        
        for event in relevant_events:
            factor = {
                'event': event.title,
                'type': event.event_type,
                'impact': event.impact_score,
                'duration': str(event.end_time - event.start_time) if event.end_time else 'ongoing',
                'keywords': event.keywords
            }
            
            # Determinar si el evento es positivo o negativo para el engagement
            if event.event_type in ['trending_topic', 'holiday']:
                positive_impact += event.impact_score
                factor['effect'] = 'positive'
            elif event.event_type in ['weather_event']:
                negative_impact += event.impact_score
                factor['effect'] = 'negative'
            else:
                # Eventos neutros como competitor_activity
                if event.impact_score > 0.7:
                    negative_impact += event.impact_score * 0.3  # Reducir ligeramente
                    factor['effect'] = 'competitive'
                else:
                    factor['effect'] = 'neutral'
            
            impact_factors.append(factor)
        
        # Calcular impacto general
        net_impact = 1.0 + (positive_impact * 0.3) - (negative_impact * 0.2)
        net_impact = max(0.5, min(1.5, net_impact))  # Límites razonables
        
        # Generar recomendaciones
        recommendations = self._generate_context_recommendations(
            relevant_events, net_impact, platform, content_type
        )
        
        # Calcular ajuste temporal óptimo
        optimal_adjustment = self._calculate_timing_adjustment(relevant_events)
        
        # Score de contexto (0-1)
        context_score = min(1.0, (positive_impact + (1.0 - negative_impact)) / 2)
        
        return {
            'overall_impact': net_impact,
            'impact_factors': impact_factors,
            'recommendations': recommendations,
            'optimal_adjustment': optimal_adjustment,  # Horas para ajustar
            'context_score': context_score,
            'events_count': len(relevant_events),
            'positive_events': len([e for e in relevant_events if e.event_type in ['trending_topic', 'holiday']]),
            'negative_events': len([e for e in relevant_events if e.event_type in ['weather_event']])
        }
    
    def _generate_context_recommendations(self, events: List[ContextualEvent], 
                                        net_impact: float,
                                        platform: str,
                                        content_type: str) -> List[str]:
        """Genera recomendaciones basadas en el contexto"""
        
        recommendations = []
        
        if net_impact > 1.2:
            recommendations.append("🟢 Excelente momento para publicar - eventos positivos detectados")
        elif net_impact < 0.8:
            recommendations.append("🔴 Considerar retrasar publicación - contexto desfavorable")
        else:
            recommendations.append("🟡 Momento neutral - proceder según plan original")
        
        # Recomendaciones específicas por tipo de evento
        for event in events:
            if event.event_type == 'trending_topic':
                recommendations.append(f"💡 Incorporar keywords: {', '.join(event.keywords[:3])}")
            elif event.event_type == 'holiday':
                recommendations.append(f"🎉 Aprovechar festividad: {event.title}")
            elif event.event_type == 'competitor_activity' and event.impact_score > 0.7:
                recommendations.append("⚠️  Alta actividad competitiva - considerar diferenciación")
            elif event.event_type == 'weather_event':
                recommendations.append("🌩️  Evento meteorológico - engagement puede reducirse")
        
        return recommendations
    
    def _calculate_timing_adjustment(self, events: List[ContextualEvent]) -> float:
        """Calcula ajuste de timing recomendado en horas"""
        
        adjustment = 0.0
        
        for event in events:
            if event.event_type == 'competitor_activity' and event.impact_score > 0.7:
                # Sugerir publicar 1-2 horas antes o después del pico competitivo
                adjustment += np.random.choice([-2, -1, 1, 2])
            elif event.event_type == 'weather_event':
                # Retrasar hasta después del evento meteorológico
                adjustment += 3
            elif event.event_type == 'trending_topic':
                # Publicar lo antes posible para aprovechar tendencia
                adjustment -= 0.5
        
        # Limitar ajuste a ±6 horas
        return max(-6, min(6, adjustment))

# Ejemplo de integración con el predictor ML
def integrate_contextual_analysis():
    """Ejemplo de integración del análisis contextual con predicción ML"""
    
    print("🧠 Iniciando análisis contextual integrado...")
    
    # Inicializar sistemas
    context_engine = ContextualAnalysisEngine()
    
    # Parámetros de contenido
    content_params = {
        'platform': 'instagram',
        'content_type': 'video',
        'audience_segment': 'millennials',
        'timezone': 'EST',
        'audience_location': 'US'
    }
    
    # Analizar próximas 24 horas
    future_slots = []
    now = datetime.now()
    
    for hour in range(24):
        target_time = now + timedelta(hours=hour)
        
        # Análisis contextual
        context = context_engine.analyze_publishing_context(
            target_time, 
            content_params['platform'],
            content_params['content_type'],
            content_params.get('audience_location', 'US')
        )
        
        slot_info = {
            'datetime': target_time,
            'hour': target_time.hour,
            'context_score': context['context_score'],
            'overall_impact': context['overall_impact'],
            'recommendations': context['recommendations'],
            'events_count': context['events_count'],
            'adjustment_hours': context['optimal_adjustment']
        }
        
        future_slots.append(slot_info)
    
    # Ordenar por score contextual
    future_slots.sort(key=lambda x: x['context_score'], reverse=True)
    
    print("\n⏰ Top 10 slots con mejor contexto:")
    for i, slot in enumerate(future_slots[:10]):
        print(f"{i+1:2d}. {slot['datetime'].strftime('%H:%M')} - "
              f"Context Score: {slot['context_score']:.3f} - "
              f"Impact: {slot['overall_impact']:.3f} - "
              f"Events: {slot['events_count']}")
        
        if slot['recommendations']:
            print(f"    📋 {slot['recommendations'][0]}")
    
    return context_engine, future_slots

if __name__ == "__main__":
    context_engine, slots = integrate_contextual_analysis()
```

## 3. Componente 2: Scheduling Inteligente por Zona Horaria y Audiencia

### 3.1 Geo-Temporal Scheduler

```python
import pytz
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import json
from collections import defaultdict

@dataclass
class AudienceSegment:
    """Estructura de datos para segmentos de audiencia"""
    segment_id: str
    name: str
    timezone: str
    preferred_times: List[Tuple[int, int]]  # (hour, minute) pairs
    platform_preferences: Dict[str, float]  # platform -> engagement weight
    demographic: Dict[str, str]
    size: int
    engagement_patterns: Dict[str, float]  # hourly patterns

@dataclass
class GeographicalZone:
    """Estructura para zonas geográficas"""
    zone_id: str
    name: str
    timezone: str
    countries: List[str]
    languages: List[str]
    cultural_events: List[str]
    business_hours: Tuple[int, int]
    peak_social_hours: List[Tuple[int, int]]

class GeoTemporalScheduler:
    """
    Sistema avanzado de scheduling inteligente por zona horaria y audiencia
    con optimización automática de timing por segmentos geográficos
    """
    
    def __init__(self):
        self.audience_segments = {}
        self.geographical_zones = {}
        self.platform_peak_hours = {}
        self.initialized = False
        self._setup_default_zones()
        self._setup_platform_patterns()
    
    def _setup_default_zones(self):
        """Configura zonas geográficas por defecto"""
        
        default_zones = [
            GeographicalZone(
                zone_id="north_america_east",
                name="North America East",
                timezone="America/New_York",
                countries=["US", "CA"],
                languages=["en", "fr"],
                cultural_events=["thanksgiving", "independence_day", "christmas"],
                business_hours=(9, 17),
                peak_social_hours=[(8, 9), (12, 13), (19, 22)]
            ),
            GeographicalZone(
                zone_id="north_america_west",
                name="North America West",
                timezone="America/Los_Angeles",
                countries=["US", "CA"],
                languages=["en", "es"],
                cultural_events=["thanksgiving", "independence_day", "christmas"],
                business_hours=(9, 17),
                peak_social_hours=[(8, 9), (12, 13), (19, 22)]
            ),
            GeographicalZone(
                zone_id="europe_central",
                name="Central Europe",
                timezone="Europe/Berlin",
                countries=["DE", "FR", "IT", "ES", "NL", "BE"],
                languages=["de", "fr", "it", "es", "nl"],
                cultural_events=["christmas", "easter", "new_year"],
                business_hours=(9, 18),
                peak_social_hours=[(7, 9), (12, 14), (18, 21)]
            ),
            GeographicalZone(
                zone_id="europe_uk",
                name="United Kingdom & Ireland",
                timezone="Europe/London",
                countries=["GB", "IE"],
                languages=["en"],
                cultural_events=["christmas", "easter", "boxing_day"],
                business_hours=(9, 17),
                peak_social_hours=[(8, 9), (12, 13), (18, 21)]
            ),
            GeographicalZone(
                zone_id="asia_east",
                name="East Asia",
                timezone="Asia/Tokyo",
                countries=["JP", "KR"],
                languages=["ja", "ko"],
                cultural_events=["golden_week", "new_year", "chuseok"],
                business_hours=(9, 18),
                peak_social_hours=[(7, 9), (12, 13), (19, 23)]
            ),
            GeographicalZone(
                zone_id="asia_southeast",
                name="Southeast Asia",
                timezone="Asia/Singapore",
                countries=["SG", "MY", "TH", "ID", "PH"],
                languages=["en", "ms", "th", "id", "tl"],
                cultural_events=["chinese_new_year", "eid", "diwali"],
                business_hours=(9, 18),
                peak_social_hours=[(7, 9), (12, 13), (19, 22)]
            ),
            GeographicalZone(
                zone_id="australia_pacific",
                name="Australia & Pacific",
                timezone="Australia/Sydney",
                countries=["AU", "NZ"],
                languages=["en"],
                cultural_events=["anzac_day", "australia_day", "christmas"],
                business_hours=(9, 17),
                peak_social_hours=[(7, 9), (12, 13), (18, 21)]
            ),
            GeographicalZone(
                zone_id="latin_america",
                name="Latin America",
                timezone="America/Sao_Paulo",
                countries=["BR", "AR", "MX", "CO", "CL"],
                languages=["es", "pt"],
                cultural_events=["carnival", "dia_de_los_muertos", "christmas"],
                business_hours=(9, 18),
                peak_social_hours=[(7, 9), (12, 14), (19, 22)]
            )
        ]
        
        for zone in default_zones:
            self.geographical_zones[zone.zone_id] = zone
    
    def _setup_platform_patterns(self):
        """Configura patrones de engagement por plataforma y zona"""
        
        self.platform_peak_hours = {
            'instagram': {
                'north_america_east': [(8, 9), (12, 13), (19, 21)],
                'europe_central': [(7, 9), (12, 14), (18, 20)],
                'asia_east': [(7, 9), (12, 13), (20, 23)],
                'global_default': [(8, 9), (12, 13), (19, 21)]
            },
            'tiktok': {
                'north_america_east': [(15, 18), (19, 22)],
                'europe_central': [(16, 19), (20, 22)],
                'asia_east': [(19, 23)],
                'global_default': [(16, 18), (19, 22)]
            },
            'twitter': {
                'north_america_east': [(9, 10), (12, 13), (17, 18)],
                'europe_central': [(8, 10), (13, 14), (17, 19)],
                'asia_east': [(9, 10), (12, 13), (19, 21)],
                'global_default': [(9, 10), (12, 13), (17, 18)]
            },
            'linkedin': {
                'north_america_east': [(8, 10), (12, 13), (17, 18)],
                'europe_central': [(8, 10), (12, 14), (17, 18)],
                'asia_east': [(9, 10), (12, 13), (17, 19)],
                'global_default': [(8, 10), (12, 13), (17, 18)]
            },
            'facebook': {
                'north_america_east': [(9, 10), (15, 16), (20, 21)],
                'europe_central': [(9, 10), (14, 16), (19, 21)],
                'asia_east': [(9, 10), (15, 16), (20, 22)],
                'global_default': [(9, 10), (15, 16), (20, 21)]
            },
            'youtube': {
                'north_america_east': [(14, 16), (20, 22)],
                'europe_central': [(15, 17), (19, 21)],
                'asia_east': [(19, 22)],
                'global_default': [(15, 17), (20, 22)]
            }
        }
    
    def add_audience_segment(self, segment: AudienceSegment):
        """Añade un segmento de audiencia al scheduler"""
        self.audience_segments[segment.segment_id] = segment
    
    def create_default_segments(self):
        """Crea segmentos de audiencia por defecto basados en datos demográficos"""
        
        # Segmentos Gen Z
        gen_z_segments = [
            AudienceSegment(
                segment_id="gen_z_us_east",
                name="Gen Z - US East Coast",
                timezone="America/New_York",
                preferred_times=[(16, 0), (19, 0), (21, 0)],
                platform_preferences={'tiktok': 0.9, 'instagram': 0.8, 'twitter': 0.6},
                demographic={'age_range': '16-24', 'region': 'US_East', 'interests': 'entertainment,gaming,music'},
                size=850000,
                engagement_patterns={str(h): 0.8 if h in [16, 17, 19, 20, 21] else 0.4 for h in range(24)}
            ),
            AudienceSegment(
                segment_id="gen_z_europe",
                name="Gen Z - Central Europe",
                timezone="Europe/Berlin",
                preferred_times=[(17, 0), (20, 0), (22, 0)],
                platform_preferences={'tiktok': 0.9, 'instagram': 0.8, 'youtube': 0.7},
                demographic={'age_range': '16-24', 'region': 'Europe_Central', 'interests': 'entertainment,lifestyle,travel'},
                size=650000,
                engagement_patterns={str(h): 0.8 if h in [17, 18, 20, 21, 22] else 0.4 for h in range(24)}
            )
        ]
        
        # Segmentos Millennials
        millennial_segments = [
            AudienceSegment(
                segment_id="millennials_us_coast",
                name="Millennials - US Both Coasts",
                timezone="America/New_York",  # Promedio
                preferred_times=[(8, 0), (12, 0), (19, 0)],
                platform_preferences={'instagram': 0.9, 'facebook': 0.7, 'linkedin': 0.8},
                demographic={'age_range': '25-40', 'region': 'US', 'interests': 'career,family,lifestyle'},
                size=1200000,
                engagement_patterns={str(h): 0.8 if h in [8, 9, 12, 13, 19, 20] else 0.5 for h in range(24)}
            ),
            AudienceSegment(
                segment_id="millennials_europe",
                name="Millennials - Europe",
                timezone="Europe/London",
                preferred_times=[(8, 0), (12, 30), (18, 0)],
                platform_preferences={'linkedin': 0.9, 'instagram': 0.8, 'facebook': 0.7},
                demographic={'age_range': '25-40', 'region': 'Europe', 'interests': 'career,travel,technology'},
                size=900000,
                engagement_patterns={str(h): 0.8 if h in [8, 9, 12, 13, 18, 19] else 0.5 for h in range(24)}
            )
        ]
        
        # Segmentos Profesionales
        professional_segments = [
            AudienceSegment(
                segment_id="professionals_global",
                name="Business Professionals - Global",
                timezone="UTC",
                preferred_times=[(9, 0), (13, 0), (17, 0)],
                platform_preferences={'linkedin': 1.0, 'twitter': 0.8, 'facebook': 0.5},
                demographic={'age_range': '30-55', 'region': 'Global', 'interests': 'business,leadership,innovation'},
                size=750000,
                engagement_patterns={str(h): 0.9 if h in [9, 10, 13, 14, 17, 18] else 0.3 for h in range(24)}
            )
        ]
        
        # Añadir todos los segmentos
        all_segments = gen_z_segments + millennial_segments + professional_segments
        for segment in all_segments:
            self.add_audience_segment(segment)
        
        self.initialized = True
        print(f"✅ Configurados {len(all_segments)} segmentos de audiencia por defecto")
    
    def calculate_optimal_timing(self, 
                               content_params: Dict,
                               target_segments: List[str] = None,
                               time_window_hours: int = 168) -> List[Dict]:
        """
        Calcula timing óptimo considerando múltiples segmentos y zonas horarias
        
        Args:
            content_params: Parámetros del contenido (platform, type, etc.)
            target_segments: Lista de IDs de segmentos objetivo (None = todos)
            time_window_hours: Ventana de tiempo para análisis
        
        Returns:
            Lista de horarios óptimos con scores por segmento
        """
        
        if not self.initialized:
            self.create_default_segments()
        
        platform = content_params.get('platform', 'instagram')
        
        # Filtrar segmentos objetivo
        if target_segments:
            segments = {k: v for k, v in self.audience_segments.items() if k in target_segments}
        else:
            segments = self.audience_segments
        
        # Generar slots de tiempo
        now = datetime.utcnow()
        time_slots = []
        
        for hours_offset in range(time_window_hours):
            slot_time_utc = now + timedelta(hours=hours_offset)
            time_slots.append(slot_time_utc)
        
        # Calcular scores por slot y segmento
        timing_analysis = []
        
        for slot_time_utc in time_slots:
            slot_analysis = {
                'datetime_utc': slot_time_utc,
                'segment_scores': {},
                'weighted_score': 0.0,
                'timezone_coverage': {},
                'platform_alignment': 0.0,
                'total_audience_size': 0
            }
            
            total_weighted_score = 0.0
            total_weight = 0.0
            
            # Analizar cada segmento
            for segment_id, segment in segments.items():
                # Convertir tiempo a zona horaria del segmento
                segment_tz = pytz.timezone(segment.timezone)
                local_time = slot_time_utc.replace(tzinfo=pytz.UTC).astimezone(segment_tz)
                
                # Calcular score para este segmento y horario
                segment_score = self._calculate_segment_score(
                    segment, local_time, platform, content_params
                )
                
                slot_analysis['segment_scores'][segment_id] = {
                    'score': segment_score,
                    'local_time': local_time.strftime('%Y-%m-%d %H:%M %Z'),
                    'local_hour': local_time.hour,
                    'segment_size': segment.size
                }
                
                # Contribución ponderada por tamaño de segmento
                weight = segment.size * segment.platform_preferences.get(platform, 0.5)
                total_weighted_score += segment_score * weight
                total_weight += weight
                
                slot_analysis['total_audience_size'] += segment.size
                
                # Tracking de cobertura por zona horaria
                if segment.timezone not in slot_analysis['timezone_coverage']:
                    slot_analysis['timezone_coverage'][segment.timezone] = []
                slot_analysis['timezone_coverage'][segment.timezone].append({
                    'segment': segment_id,
                    'local_hour': local_time.hour,
                    'score': segment_score
                })
            
            # Score final ponderado
            if total_weight > 0:
                slot_analysis['weighted_score'] = total_weighted_score / total_weight
            
            # Score de alineación con patrones de plataforma
            slot_analysis['platform_alignment'] = self._calculate_platform_alignment_score(
                slot_time_utc, platform, segments
            )
            
            # Score final combinado
            slot_analysis['final_score'] = (
                slot_analysis['weighted_score'] * 0.7 + 
                slot_analysis['platform_alignment'] * 0.3
            )
            
            timing_analysis.append(slot_analysis)
        
        # Ordenar por score final
        timing_analysis.sort(key=lambda x: x['final_score'], reverse=True)
        
        return timing_analysis
    
    def _calculate_segment_score(self, segment: AudienceSegment, 
                               local_time: datetime, 
                               platform: str,
                               content_params: Dict) -> float:
        """Calcula score de engagement para un segmento específico en un horario local"""
        
        hour = local_time.hour
        day_of_week = local_time.weekday()
        
        # Score base por patrón de engagement del segmento
        base_score = segment.engagement_patterns.get(str(hour), 0.5)
        
        # Ajuste por preferencia de plataforma
        platform_multiplier = segment.platform_preferences.get(platform, 0.5)
        
        # Ajuste por horarios preferidos del segmento
        preferred_hour_bonus = 0.0
        for pref_hour, pref_minute in segment.preferred_times:
            time_diff = abs(hour - pref_hour)
            if time_diff <= 1:  # Dentro de 1 hora del tiempo preferido
                preferred_hour_bonus = max(preferred_hour_bonus, 0.3 * (1 - time_diff / 2))
        
        # Ajuste por día de la semana
        weekday_multiplier = 1.0
        if day_of_week >= 5:  # Fin de semana
            if 'gen_z' in segment.segment_id.lower():
                weekday_multiplier = 1.2  # Gen Z más activo en fines de semana
            elif 'professional' in segment.segment_id.lower():
                weekday_multiplier = 0.7  # Profesionales menos activos
        
        # Score final
        final_score = (base_score + preferred_hour_bonus) * platform_multiplier * weekday_multiplier
        
        return min(1.0, final_score)
    
    def _calculate_platform_alignment_score(self, slot_time_utc: datetime, 
                                          platform: str, 
                                          segments: Dict) -> float:
        """Calcula qué tan bien se alinea el horario con patrones globales de la plataforma"""
        
        platform_scores = []
        
        # Evaluar alineación con cada zona geográfica representada
        for segment in segments.values():
            # Encontrar zona geográfica correspondiente
            zone = None
            for zone_candidate in self.geographical_zones.values():
                if segment.timezone == zone_candidate.timezone:
                    zone = zone_candidate
                    break
            
            if not zone:
                continue
            
            # Convertir tiempo a zona local
            zone_tz = pytz.timezone(zone.timezone)
            local_time = slot_time_utc.replace(tzinfo=pytz.UTC).astimezone(zone_tz)
            
            # Obtener horas pico para plataforma en esta zona
            platform_peaks = self.platform_peak_hours.get(platform, {})
            zone_peaks = platform_peaks.get(zone.zone_id, platform_peaks.get('global_default', []))
            
            # Calcular score de alineación
            alignment_score = 0.0
            for peak_start, peak_end in zone_peaks:
                if peak_start <= local_time.hour <= peak_end:
                    alignment_score = 1.0
                    break
                else:
                    # Score decreciente basado en distancia al pico más cercano
                    min_distance = min(
                        abs(local_time.hour - peak_start),
                        abs(local_time.hour - peak_end)
                    )
                    if min_distance <= 2:
                        alignment_score = max(alignment_score, 1.0 - (min_distance / 3))
            
            platform_scores.append(alignment_score)
        
        return np.mean(platform_scores) if platform_scores else 0.5
    
    def schedule_multi_timezone_campaign(self, campaign_config: Dict) -> Dict:
        """
        Programa una campaña coordinada multi-zona horaria
        
        Args:
            campaign_config: Configuración de campaña
                - content_variants: Variantes de contenido
                - target_segments: Segmentos objetivo
                - campaign_duration_hours: Duración de campaña
                - posts_per_day: Posts por día
                - platforms: Plataformas objetivo
        
        Returns:
            Plan de publicación detallado por zona horaria
        """
        
        schedule_plan = {
            'campaign_id': f"campaign_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'created_at': datetime.utcnow().isoformat(),
            'total_posts_planned': 0,
            'timezone_schedules': {},
            'coordination_windows': [],
            'expected_reach': 0
        }
        
        target_segments = campaign_config.get('target_segments', list(self.audience_segments.keys()))
        platforms = campaign_config.get('platforms', ['instagram'])
        posts_per_day = campaign_config.get('posts_per_day', 2)
        campaign_duration_hours = campaign_config.get('campaign_duration_hours', 168)  # 1 semana
        
        # Agrupar segmentos por zona horaria
        timezone_groups = defaultdict(list)
        for segment_id in target_segments:
            if segment_id in self.audience_segments:
                segment = self.audience_segments[segment_id]
                timezone_groups[segment.timezone].append(segment_id)
        
        # Calcular horarios óptimos para cada zona
        for timezone, segment_ids in timezone_groups.items():
            print(f"📍 Calculando horarios para zona: {timezone}")
            
            optimal_times = self.calculate_optimal_timing(
                content_params={'platform': platforms[0]},  # Usar primera plataforma como referencia
                target_segments=segment_ids,
                time_window_hours=campaign_duration_hours
            )
            
            # Seleccionar mejores slots según posts_per_day
            daily_slots = []
            slots_per_day = posts_per_day
            days_in_campaign = campaign_duration_hours // 24
            
            selected_slots = optimal_times[:slots_per_day * days_in_campaign]
            
            # Organizar por días
            timezone_schedule = {
                'timezone': timezone,
                'segments': segment_ids,
                'daily_schedules': {},
                'total_posts': len(selected_slots)
            }
            
            for slot in selected_slots:
                day_key = slot['datetime_utc'].strftime('%Y-%m-%d')
                if day_key not in timezone_schedule['daily_schedules']:
                    timezone_schedule['daily_schedules'][day_key] = []
                
                timezone_schedule['daily_schedules'][day_key].append({
                    'datetime_utc': slot['datetime_utc'].isoformat(),
                    'score': slot['final_score'],
                    'segment_coverage': list(slot['segment_scores'].keys()),
                    'estimated_reach': sum(
                        self.audience_segments[seg_id].size 
                        for seg_id in segment_ids 
                        if seg_id in self.audience_segments
                    )
                })
            
            schedule_plan['timezone_schedules'][timezone] = timezone_schedule
            schedule_plan['total_posts_planned'] += len(selected_slots)
            
            # Calcular reach esperado
            reach = sum(
                self.audience_segments[seg_id].size 
                for seg_id in segment_ids 
                if seg_id in self.audience_segments
            )
            schedule_plan['expected_reach'] += reach
        
        # Identificar ventanas de coordinación global
        coordination_windows = self._find_coordination_windows(schedule_plan['timezone_schedules'])
        schedule_plan['coordination_windows'] = coordination_windows
        
        return schedule_plan
    
    def _find_coordination_windows(self, timezone_schedules: Dict) -> List[Dict]:
        """Encuentra ventanas de tiempo para coordinación global"""
        
        coordination_windows = []
        
        # Buscar slots donde múltiples zonas horarias tengan actividad simultánea
        all_slots = []
        for tz, schedule in timezone_schedules.items():
            for day, slots in schedule['daily_schedules'].items():
                for slot in slots:
                    all_slots.append({
                        'datetime_utc': datetime.fromisoformat(slot['datetime_utc']),
                        'timezone': tz,
                        'score': slot['score'],
                        'reach': slot['estimated_reach']
                    })
        
        # Agrupar slots por ventanas de 2 horas
        time_windows = defaultdict(list)
        for slot in all_slots:
            window_key = slot['datetime_utc'].replace(minute=0, second=0, microsecond=0)
            window_key = window_key.replace(hour=(window_key.hour // 2) * 2)  # Ventanas de 2h
            time_windows[window_key].append(slot)
        
        # Identificar ventanas con múltiples zonas horarias
        for window_time, slots in time_windows.items():
            unique_timezones = set(slot['timezone'] for slot in slots)
            
            if len(unique_timezones) >= 2:  # Al menos 2 zonas horarias
                coordination_windows.append({
                    'window_start': window_time.isoformat(),
                    'window_end': (window_time + timedelta(hours=2)).isoformat(),
                    'timezones_involved': list(unique_timezones),
                    'total_slots': len(slots),
                    'combined_reach': sum(slot['reach'] for slot in slots),
                    'average_score': np.mean([slot['score'] for slot in slots]),
                    'coordination_opportunity': 'high' if len(unique_timezones) >= 3 else 'medium'
                })
        
        # Ordenar por oportunidad de coordinación
        coordination_windows.sort(key=lambda x: (len(x['timezones_involved']), x['average_score']), reverse=True)
        
        return coordination_windows[:10]  # Top 10 oportunidades

# Ejemplo de uso del Geo-Temporal Scheduler
def example_geo_temporal_scheduling():
    """Ejemplo práctico del sistema de scheduling geo-temporal"""
    
    print("🌍 Iniciando sistema de scheduling geo-temporal...")
    
    # Inicializar scheduler
    scheduler = GeoTemporalScheduler()
    scheduler.create_default_segments()
    
    # Configurar campaña multi-zona horaria
    campaign_config = {
        'content_variants': ['video_1', 'image_1', 'carousel_1'],
        'target_segments': ['gen_z_us_east', 'millennials_europe', 'professionals_global'],
        'campaign_duration_hours': 72,  # 3 días
        'posts_per_day': 3,
        'platforms': ['instagram', 'tiktok']
    }
    
    print("\n📋 Configuración de campaña:")
    print(f"  📅 Duración: {campaign_config['campaign_duration_hours']} horas")
    print(f"  📈 Posts por día: {campaign_config['posts_per_day']}")
    print(f"  🎯 Segmentos objetivo: {len(campaign_config['target_segments'])}")
    print(f"  📱 Plataformas: {', '.join(campaign_config['platforms'])}")
    
    # Calcular horarios óptimos
    print("\n⏰ Calculando horarios óptimos por zona...")
    optimal_timing = scheduler.calculate_optimal_timing(
        content_params={'platform': 'instagram', 'content_type': 'video'},
        target_segments=campaign_config['target_segments'],
        time_window_hours=24
    )
    
    # Mostrar top 10 horarios
    print("\n🏆 Top 10 horarios optimizados:")
    for i, timing in enumerate(optimal_timing[:10]):
        print(f"{i+1:2d}. {timing['datetime_utc'].strftime('%Y-%m-%d %H:%M UTC')} - "
              f"Score: {timing['final_score']:.3f} - "
              f"Audiencia: {timing['total_audience_size']:,}")
        
        # Mostrar detalles por segmento
        for seg_id, seg_info in timing['segment_scores'].items():
            print(f"     📍 {seg_id}: {seg_info['local_time']} - Score: {seg_info['score']:.3f}")
    
    # Programar campaña completa
    print("\n🚀 Generando plan de campaña multi-zona horaria...")
    campaign_schedule = scheduler.schedule_multi_timezone_campaign(campaign_config)
    
    print(f"\n📊 Resumen del plan de campaña:")
    print(f"  🆔 ID: {campaign_schedule['campaign_id']}")
    print(f"  📝 Posts planificados: {campaign_schedule['total_posts_planned']}")
    print(f"  🎯 Reach esperado: {campaign_schedule['expected_reach']:,}")
    print(f"  🌍 Zonas horarias: {len(campaign_schedule['timezone_schedules'])}")
    print(f"  🔗 Ventanas de coordinación: {len(campaign_schedule['coordination_windows'])}")
    
    # Mostrar schedule por zona horaria
    print("\n📍 Schedule por zona horaria:")
    for timezone, schedule in campaign_schedule['timezone_schedules'].items():
        print(f"\n  🌍 {timezone}:")
        print(f"    📊 Segmentos: {len(schedule['segments'])}")
        print(f"    📝 Posts totales: {schedule['total_posts']}")
        print(f"    📅 Días programados: {len(schedule['daily_schedules'])}")
        
        # Mostrar primeros días
        for day, slots in list(schedule['daily_schedules'].items())[:2]:
            print(f"    📆 {day}:")
            for slot in slots:
                utc_time = datetime.fromisoformat(slot['datetime_utc'])
                print(f"      ⏰ {utc_time.strftime('%H:%M')} UTC - Score: {slot['score']:.3f}")
    
    # Mostrar oportunidades de coordinación
    print("\n🔗 Top 5 oportunidades de coordinación global:")
    for i, coord in enumerate(campaign_schedule['coordination_windows'][:5]):
        start_time = datetime.fromisoformat(coord['window_start'])
        print(f"{i+1}. {start_time.strftime('%Y-%m-%d %H:%M')} UTC - "
              f"{len(coord['timezones_involved'])} zonas - "
              f"Reach: {coord['combined_reach']:,} - "
              f"Oportunidad: {coord['coordination_opportunity']}")
    
    return scheduler, campaign_schedule

if __name__ == "__main__":
    scheduler, schedule = example_geo_temporal_scheduling()
```

## 4. Componente 3: Optimización por Algoritmos de Plataforma

### 4.1 Platform Algorithm Optimizer

```python
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
from enum import Enum
import json

class PlatformType(Enum):
    """Enumeración de tipos de plataformas soportadas"""
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    FACEBOOK = "facebook"
    YOUTUBE = "youtube"

@dataclass
class AlgorithmRule:
    """Estructura para reglas específicas de algoritmo"""
    rule_id: str
    platform: str
    rule_type: str  # 'timing', 'frequency', 'content', 'engagement'
    description: str
    weight: float  # Importancia relativa (0-1)
    parameters: Dict[str, Any]
    active: bool = True
    last_updated: datetime = field(default_factory=datetime.now)

@dataclass
class PlatformMetrics:
    """Métricas específicas de plataforma"""
    platform: str
    optimal_frequency: Dict[str, int]  # posts per timeframe
    peak_engagement_windows: List[Tuple[int, int]]  # hour ranges
    content_decay_rate: float  # how fast content loses visibility
    algorithm_factors: Dict[str, float]  # factor -> importance weight
    user_behavior_patterns: Dict[str, Any]
    updated_date: str

class PlatformAlgorithmOptimizer:
    """
    Sistema avanzado de optimización basado en algoritmos específicos 
    de cada plataforma para maximizar visibilidad y engagement
    """
    
    def __init__(self):
        self.platform_rules = {}
        self.platform_metrics = {}
        self.algorithm_updates_history = {}
        self.adaptive_learning_enabled = True
        self._initialize_platform_algorithms()
    
    def _initialize_platform_algorithms(self):
        """Inicializa reglas y métricas basadas en algoritmos 2025"""
        
        # Datos basados en especificaciones de redes sociales 2025
        platform_configs = {
            'instagram': {
                'optimal_frequency': {'daily': 1, 'weekly': 7, 'monthly': 30},
                'peak_engagement_windows': [(8, 9), (12, 13), (19, 21)],
                'content_decay_rate': 0.3,  # 30% pérdida de visibilidad por día
                'algorithm_factors': {
                    'early_engagement': 0.35,  # Engagement en primeras 3 horas
                    'saves': 0.25,  # Saves como señal de calidad
                    'shares': 0.20,  # Shares para viralidad
                    'comments': 0.15,  # Comentarios de calidad
                    'profile_visits': 0.05   # Visitas al perfil
                },
                'user_behavior_patterns': {
                    'story_viewing_peak': [(7, 9), (18, 21)],
                    'reels_consumption_peak': [(15, 17), (20, 23)],
                    'feed_browsing_peak': [(8, 10), (19, 21)],
                    'weekend_activity_increase': 1.2
                }
            },
            
            'tiktok': {
                'optimal_frequency': {'daily': 3, 'weekly': 21, 'monthly': 90},
                'peak_engagement_windows': [(15, 18), (19, 22)],
                'content_decay_rate': 0.5,  # Contenido pierde relevancia muy rápido
                'algorithm_factors': {
                    'completion_rate': 0.30,  # Ver video completo
                    'rewatches': 0.25,  # Repetir video
                    'shares': 0.20,  # Shares inmediatos
                    'comments': 0.15,  # Comentarios rápidos
                    'likes': 0.10   # Likes básicos
                },
                'user_behavior_patterns': {
                    'scroll_speed': 'high',  # Usuarios pasan contenido rápido
                    'attention_span': 1.3,  # 1.3 segundos para captar atención
                    'optimal_duration': (11, 17),  # 11-17 segundos según specs
                    'trending_participation_bonus': 0.4
                }
            },
            
            'twitter': {
                'optimal_frequency': {'daily': 5, 'weekly': 35, 'monthly': 150},
                'peak_engagement_windows': [(9, 10), (12, 13), (17, 18)],
                'content_decay_rate': 0.8,  # Contenido pierde relevancia MUY rápido
                'algorithm_factors': {
                    'early_retweets': 0.30,  # RTs en primeros 30 minutos
                    'replies': 0.25,  # Conversaciones generadas
                    'clicks': 0.20,  # CTR en enlaces
                    'likes': 0.15,  # Likes rápidos
                    'impressions': 0.10  # Alcance base
                },
                'user_behavior_patterns': {
                    'real_time_events': 'high_impact',
                    'thread_engagement': 'enhanced',
                    'hashtag_effectiveness': [(1, 2)],  # Max 2 hashtags
                    'breaking_news_boost': 2.0
                }
            },
            
            'linkedin': {
                'optimal_frequency': {'daily': 1, 'weekly': 5, 'monthly': 20},
                'peak_engagement_windows': [(8, 10), (12, 14), (17, 18)],
                'content_decay_rate': 0.2,  # Contenido mantiene relevancia más tiempo
                'algorithm_factors': {
                    'professional_relevance': 0.30,  # Relevancia profesional
                    'meaningful_comments': 0.25,  # Comentarios largos/thoughtful
                    'industry_keywords': 0.20,  # Palabras clave del sector
                    'company_engagement': 0.15,  # Engagement de empresa
                    'connection_shares': 0.10  # Shares entre conexiones
                },
                'user_behavior_patterns': {
                    'business_hours_priority': True,
                    'weekend_activity_decrease': 0.7,
                    'long_form_content_preference': True,
                    'thought_leadership_bonus': 0.3
                }
            },
            
            'facebook': {
                'optimal_frequency': {'daily': 1, 'weekly': 5, 'monthly': 20},
                'peak_engagement_windows': [(9, 10), (15, 16), (20, 21)],
                'content_decay_rate': 0.25,  # Decline moderado
                'algorithm_factors': {
                    'meaningful_interactions': 0.35,  # Interacciones significativas
                    'time_spent': 0.25,  # Tiempo viendo contenido
                    'video_completion': 0.20,  # Completar videos
                    'shares_to_close_friends': 0.15,  # Shares privados
                    'group_engagement': 0.05  # Participación en grupos
                },
                'user_behavior_patterns': {
                    'family_friend_priority': True,
                    'video_first_algorithm': True,
                    'story_engagement_separate': True,
                    'local_content_boost': 0.2
                }
            },
            
            'youtube': {
                'optimal_frequency': {'daily': 1, 'weekly': 3, 'monthly': 12},
                'peak_engagement_windows': [(14, 16), (20, 22)],
                'content_decay_rate': 0.1,  # Contenido evergreen
                'algorithm_factors': {
                    'watch_time': 0.40,  # Tiempo total de visualización
                    'ctr': 0.25,  # Click-through rate del thumbnail
                    'session_duration': 0.20,  # Mantener usuarios en plataforma
                    'subscriber_engagement': 0.10,  # Engagement de suscriptores
                    'external_traffic': 0.05  # Tráfico desde fuera de YouTube
                },
                'user_behavior_patterns': {
                    'shorts_vs_long_form': {'shorts': (0.6), 'long': (0.4)},
                    'thumbnail_importance': 'critical',
                    'first_15_seconds_crucial': True,
                    'binge_watching_bonus': 0.3
                }
            }
        }
        
        # Inicializar métricas de plataforma
        for platform, config in platform_configs.items():
            self.platform_metrics[platform] = PlatformMetrics(
                platform=platform,
                optimal_frequency=config['optimal_frequency'],
                peak_engagement_windows=config['peak_engagement_windows'],
                content_decay_rate=config['content_decay_rate'],
                algorithm_factors=config['algorithm_factors'],
                user_behavior_patterns=config['user_behavior_patterns'],
                updated_date="2025-01-01"
            )
        
        # Inicializar reglas específicas de algoritmo
        self._create_algorithm_rules()
    
    def _create_algorithm_rules(self):
        """Crea reglas específicas basadas en conocimiento de algoritmos 2025"""
        
        algorithm_rules = [
            # Instagram Rules
            AlgorithmRule(
                rule_id="ig_early_engagement",
                platform="instagram",
                rule_type="timing",
                description="Las primeras 3 horas son críticas para el algoritmo de Instagram",
                weight=0.9,
                parameters={'critical_window_hours': 3, 'target_engagement_rate': 0.05}
            ),
            AlgorithmRule(
                rule_id="ig_story_reels_timing",
                platform="instagram",
                rule_type="timing",
                description="Stories y Reels tienen ventanas de engagement diferentes",
                weight=0.8,
                parameters={
                    'stories_optimal': [(7, 9), (18, 21)],
                    'reels_optimal': [(15, 17), (20, 23)]
                }
            ),
            AlgorithmRule(
                rule_id="ig_overposting_penalty",
                platform="instagram",
                rule_type="frequency",
                description="Más de 2 posts por día puede reducir alcance orgánico",
                weight=0.7,
                parameters={'max_daily_posts': 2, 'penalty_multiplier': 0.3}
            ),
            
            # TikTok Rules
            AlgorithmRule(
                rule_id="tiktok_completion_priority",
                platform="tiktok",
                rule_type="content",
                description="Videos que se ven completos tienen prioridad algorítmica",
                weight=0.95,
                parameters={'optimal_duration_seconds': (11, 17), 'completion_bonus': 2.0}
            ),
            AlgorithmRule(
                rule_id="tiktok_trend_participation",
                platform="tiktok",
                rule_type="timing",
                description="Participar en trends tempranas aumenta visibilidad",
                weight=0.85,
                parameters={'trend_window_hours': 48, 'early_participation_bonus': 1.5}
            ),
            AlgorithmRule(
                rule_id="tiktok_consistent_posting",
                platform="tiktok",
                rule_type="frequency",
                description="Posting consistente diario mejora performance algorítmica",
                weight=0.8,
                parameters={'min_daily_posts': 1, 'consistency_bonus': 1.3}
            ),
            
            # Twitter Rules
            AlgorithmRule(
                rule_id="twitter_real_time_boost",
                platform="twitter",
                rule_type="timing",
                description="Tweets sobre eventos en tiempo real reciben boost algorítmico",
                weight=0.9,
                parameters={'real_time_window_minutes': 30, 'boost_multiplier': 2.5}
            ),
            AlgorithmRule(
                rule_id="twitter_conversation_priority",
                platform="twitter",
                rule_type="engagement",
                description="Tweets que generan conversaciones tienen mayor alcance",
                weight=0.85,
                parameters={'reply_threshold': 5, 'conversation_bonus': 1.8}
            ),
            AlgorithmRule(
                rule_id="twitter_hashtag_limit",
                platform="twitter",
                rule_type="content",
                description="Máximo 2 hashtags para evitar penalización algorítmica",
                weight=0.75,
                parameters={'max_hashtags': 2, 'penalty_per_extra': 0.2}
            ),
            
            # LinkedIn Rules
            AlgorithmRule(
                rule_id="linkedin_business_hours",
                platform="linkedin",
                rule_type="timing",
                description="Contenido en horario laboral tiene mayor visibilidad",
                weight=0.9,
                parameters={'business_hours': (8, 18), 'weekday_bonus': 1.4}
            ),
            AlgorithmRule(
                rule_id="linkedin_thought_leadership",
                platform="linkedin",
                rule_type="content",
                description="Contenido de thought leadership recibe boost algorítmico",
                weight=0.8,
                parameters={'min_word_count': 150, 'industry_keywords_bonus': 1.3}
            ),
            AlgorithmRule(
                rule_id="linkedin_personal_vs_company",
                platform="linkedin",
                rule_type="engagement",
                description="Perfiles personales tienen mayor alcance que páginas de empresa",
                weight=0.85,
                parameters={'personal_profile_multiplier': 2.0}
            ),
            
            # YouTube Rules
            AlgorithmRule(
                rule_id="youtube_watch_time_priority",
                platform="youtube",
                rule_type="content",
                description="Tiempo de visualización es el factor algorítmico más importante",
                weight=0.95,
                parameters={'target_watch_percentage': 0.6, 'watch_time_weight': 0.4}
            ),
            AlgorithmRule(
                rule_id="youtube_ctr_optimization",
                platform="youtube",
                rule_type="content",
                description="CTR del thumbnail es crítico para distribución inicial",
                weight=0.9,
                parameters={'target_ctr': 0.08, 'thumbnail_importance': 0.25}
            ),
            AlgorithmRule(
                rule_id="youtube_shorts_algorithm",
                platform="youtube",
                rule_type="content",
                description="Shorts tienen algoritmo separado con métricas diferentes",
                weight=0.8,
                parameters={'shorts_max_duration': 60, 'shorts_engagement_window': 15}
            )
        ]
        
        # Organizar reglas por plataforma
        for rule in algorithm_rules:
            if rule.platform not in self.platform_rules:
                self.platform_rules[rule.platform] = {}
            self.platform_rules[rule.platform][rule.rule_id] = rule
    
    def optimize_posting_schedule(self, 
                                platform: str,
                                content_params: Dict,
                                target_timeframe_hours: int = 168) -> List[Dict]:
        """
        Optimiza horarios de publicación basado en algoritmos específicos de plataforma
        
        Args:
            platform: Plataforma objetivo
            content_params: Parámetros del contenido (tipo, duración, etc.)
            target_timeframe_hours: Ventana de tiempo para optimización
        
        Returns:
            Lista de slots optimizados con scores algorítmicos
        """
        
        if platform not in self.platform_metrics:
            raise ValueError(f"Plataforma {platform} no soportada")
        
        platform_data = self.platform_metrics[platform]
        platform_rules = self.platform_rules.get(platform, {})
        
        # Generar slots de tiempo
        now = datetime.now()
        time_slots = []
        
        for hour_offset in range(target_timeframe_hours):
            slot_time = now + timedelta(hours=hour_offset)
            time_slots.append(slot_time)
        
        # Evaluar cada slot
        optimized_slots = []
        
        for slot_time in time_slots:
            slot_analysis = self._analyze_slot_for_platform(
                slot_time, platform, content_params, platform_data, platform_rules
            )
            optimized_slots.append(slot_analysis)
        
        # Ordenar por score algorítmico
        optimized_slots.sort(key=lambda x: x['algorithm_score'], reverse=True)
        
        return optimized_slots
    
    def _analyze_slot_for_platform(self, 
                                 slot_time: datetime,
                                 platform: str,
                                 content_params: Dict,
                                 platform_data: PlatformMetrics,
                                 platform_rules: Dict) -> Dict:
        """Analiza un slot específico según reglas algorítmicas de la plataforma"""
        
        hour = slot_time.hour
        day_of_week = slot_time.weekday()
        
        slot_analysis = {
            'datetime': slot_time,
            'platform': platform,
            'algorithm_score': 0.0,
            'rule_scores': {},
            'peak_alignment': 0.0,
            'frequency_impact': 1.0,
            'content_optimization': 1.0,
            'recommendations': []
        }
        
        # Score base por ventanas de engagement peak
        peak_score = self._calculate_peak_alignment_score(hour, platform_data.peak_engagement_windows)
        slot_analysis['peak_alignment'] = peak_score
        
        # Aplicar reglas específicas de la plataforma
        total_rule_score = 0.0
        total_weight = 0.0
        
        for rule_id, rule in platform_rules.items():
            if not rule.active:
                continue
            
            rule_score = self._evaluate_algorithm_rule(
                rule, slot_time, content_params, platform_data
            )
            
            slot_analysis['rule_scores'][rule_id] = {
                'score': rule_score,
                'weight': rule.weight,
                'description': rule.description
            }
            
            total_rule_score += rule_score * rule.weight
            total_weight += rule.weight
        
        # Score promedio ponderado de reglas
        if total_weight > 0:
            weighted_rule_score = total_rule_score / total_weight
        else:
            weighted_rule_score = 0.5
        
        # Calcular factores adicionales específicos de plataforma
        frequency_impact = self._calculate_frequency_impact(slot_time, platform, platform_data)
        content_optimization = self._calculate_content_optimization_score(
            content_params, platform, platform_data
        )
        
        slot_analysis['frequency_impact'] = frequency_impact
        slot_analysis['content_optimization'] = content_optimization
        
        # Score algorítmico final
        algorithm_score = (
            peak_score * 0.3 +
            weighted_rule_score * 0.4 +
            frequency_impact * 0.15 +
            content_optimization * 0.15
        )
        
        slot_analysis['algorithm_score'] = min(1.0, algorithm_score)
        
        # Generar recomendaciones
        slot_analysis['recommendations'] = self._generate_algorithm_recommendations(
            slot_analysis, platform, content_params
        )
        
        return slot_analysis
    
    def _calculate_peak_alignment_score(self, hour: int, peak_windows: List[Tuple[int, int]]) -> float:
        """Calcula score de alineación con ventanas de engagement peak"""
        
        max_score = 0.0
        
        for start_hour, end_hour in peak_windows:
            if start_hour <= hour <= end_hour:
                return 1.0  # Hora pico exacta
            else:
                # Score decreciente basado en distancia
                distance = min(
                    abs(hour - start_hour),
                    abs(hour - end_hour)
                )
                if distance <= 2:
                    score = 1.0 - (distance / 3)
                    max_score = max(max_score, score)
        
        return max_score
    
    def _evaluate_algorithm_rule(self, 
                               rule: AlgorithmRule,
                               slot_time: datetime,
                               content_params: Dict,
                               platform_data: PlatformMetrics) -> float:
        """Evalúa una regla algorítmica específica para un slot"""
        
        if rule.rule_type == "timing":
            return self._evaluate_timing_rule(rule, slot_time, content_params)
        elif rule.rule_type == "frequency":
            return self._evaluate_frequency_rule(rule, slot_time, content_params)
        elif rule.rule_type == "content":
            return self._evaluate_content_rule(rule, slot_time, content_params)
        elif rule.rule_type == "engagement":
            return self._evaluate_engagement_rule(rule, slot_time, content_params)
        else:
            return 0.5  # Neutral por defecto
    
    def _evaluate_timing_rule(self, rule: AlgorithmRule, slot_time: datetime, content_params: Dict) -> float:
        """Evalúa reglas de timing específicas"""
        
        hour = slot_time.hour
        day_of_week = slot_time.weekday()
        
        if rule.rule_id == "ig_early_engagement":
            # Instagram: Primeras 3 horas críticas
            # Score alto en horarios donde audiencia está activa
            if hour in [8, 9, 12, 13, 19, 20, 21]:
                return 0.9
            elif hour in [7, 10, 11, 14, 15, 18, 22]:
                return 0.7
            else:
                return 0.4
        
        elif rule.rule_id == "ig_story_reels_timing":
            content_type = content_params.get('content_type', 'feed')
            if content_type == 'story':
                story_optimal = rule.parameters.get('stories_optimal', [])
                for start, end in story_optimal:
                    if start <= hour <= end:
                        return 0.9
                return 0.5
            elif content_type == 'reels':
                reels_optimal = rule.parameters.get('reels_optimal', [])
                for start, end in reels_optimal:
                    if start <= hour <= end:
                        return 0.9
                return 0.5
        
        elif rule.rule_id == "tiktok_trend_participation":
            # Más efectivo en horarios de máxima actividad
            if hour in [16, 17, 18, 19, 20, 21]:
                return 0.9
            elif hour in [15, 22]:
                return 0.7
            else:
                return 0.5
        
        elif rule.rule_id == "twitter_real_time_boost":
            # Twitter funciona mejor en horarios de noticias
            if hour in [7, 8, 9, 12, 17, 18, 21]:
                return 0.9
            else:
                return 0.6
        
        elif rule.rule_id == "linkedin_business_hours":
            business_hours = rule.parameters.get('business_hours', (8, 18))
            if day_of_week < 5 and business_hours[0] <= hour <= business_hours[1]:
                return 0.9
            else:
                return 0.4
        
        return 0.5
    
    def _evaluate_frequency_rule(self, rule: AlgorithmRule, slot_time: datetime, content_params: Dict) -> float:
        """Evalúa reglas de frecuencia de posting"""
        
        # Simulación - en producción consultar historial real
        if rule.rule_id == "ig_overposting_penalty":
            # Simular que no hemos posteado mucho hoy
            return 0.8
        elif rule.rule_id == "tiktok_consistent_posting":
            # TikTok favorece consistencia
            return 0.9
        
        return 0.7
    
    def _evaluate_content_rule(self, rule: AlgorithmRule, slot_time: datetime, content_params: Dict) -> float:
        """Evalúa reglas de contenido específicas"""
        
        content_type = content_params.get('content_type', 'unknown')
        
        if rule.rule_id == "tiktok_completion_priority":
            duration = content_params.get('duration_seconds', 30)
            optimal_range = rule.parameters.get('optimal_duration_seconds', (11, 17))
            if optimal_range[0] <= duration <= optimal_range[1]:
                return 0.95
            elif duration <= 30:
                return 0.8
            else:
                return 0.6
        
        elif rule.rule_id == "twitter_hashtag_limit":
            hashtag_count = content_params.get('hashtag_count', 1)
            max_hashtags = rule.parameters.get('max_hashtags', 2)
            if hashtag_count <= max_hashtags:
                return 0.9
            else:
                penalty = rule.parameters.get('penalty_per_extra', 0.2)
                return max(0.3, 0.9 - (hashtag_count - max_hashtags) * penalty)
        
        elif rule.rule_id == "linkedin_thought_leadership":
            word_count = content_params.get('word_count', 50)
            min_words = rule.parameters.get('min_word_count', 150)
            if word_count >= min_words:
                return 0.9
            else:
                return 0.6
        
        elif rule.rule_id in ["youtube_watch_time_priority", "youtube_ctr_optimization"]:
            if content_type == 'video':
                return 0.9
            else:
                return 0.5
        
        return 0.7
    
    def _evaluate_engagement_rule(self, rule: AlgorithmRule, slot_time: datetime, content_params: Dict) -> float:
        """Evalúa reglas de engagement específicas"""
        
        if rule.rule_id == "twitter_conversation_priority":
            # Contenido que invite a conversación
            if 'question' in content_params.get('content_features', []):
                return 0.9
            else:
                return 0.7
        
        elif rule.rule_id == "linkedin_personal_vs_company":
            account_type = content_params.get('account_type', 'personal')
            if account_type == 'personal':
                return 0.9
            else:
                return 0.6
        
        return 0.7
    
    def _calculate_frequency_impact(self, slot_time: datetime, platform: str, platform_data: PlatformMetrics) -> float:
        """Calcula impacto de frecuencia de posting"""
        
        optimal_daily = platform_data.optimal_frequency.get('daily', 1)
        
        # Simulación simple - en producción usar historial real
        simulated_daily_posts = np.random.randint(0, 3)
        
        if simulated_daily_posts < optimal_daily:
            return min(1.0, 0.8 + (optimal_daily - simulated_daily_posts) * 0.2)
        elif simulated_daily_posts == optimal_daily:
            return 1.0
        else:
            excess = simulated_daily_posts - optimal_daily
            return max(0.4, 1.0 - excess * 0.2)
    
    def _calculate_content_optimization_score(self, 
                                            content_params: Dict,
                                            platform: str,
                                            platform_data: PlatformMetrics) -> float:
        """Calcula score de optimización de contenido para la plataforma"""
        
        content_type = content_params.get('content_type', 'image')
        
        # Scores base por tipo de contenido y plataforma
        content_scores = {
            'instagram': {
                'image': 0.7, 'video': 0.9, 'carousel': 0.8, 
                'story': 0.8, 'reels': 0.95, 'igtv': 0.6
            },
            'tiktok': {
                'video': 1.0, 'image': 0.3, 'live': 0.8
            },
            'twitter': {
                'text': 0.8, 'image': 0.9, 'video': 0.85, 
                'gif': 0.7, 'poll': 0.9, 'thread': 0.85
            },
            'linkedin': {
                'text': 0.9, 'image': 0.7, 'video': 0.8, 
                'article': 1.0, 'document': 0.8, 'poll': 0.7
            },
            'facebook': {
                'video': 1.0, 'image': 0.7, 'text': 0.6, 
                'live': 0.9, 'event': 0.8, 'poll': 0.7
            },
            'youtube': {
                'video': 1.0, 'shorts': 0.9, 'live': 0.8, 'community': 0.6
            }
        }
        
        base_score = content_scores.get(platform, {}).get(content_type, 0.5)
        
        # Ajustes adicionales
        adjustments = 0.0
        
        # Duración óptima para video
        if content_type in ['video', 'reels', 'shorts']:
            duration = content_params.get('duration_seconds', 30)
            
            if platform == 'tiktok' and 11 <= duration <= 17:
                adjustments += 0.1
            elif platform == 'instagram' and content_type == 'reels' and 7 <= duration <= 15:
                adjustments += 0.1
            elif platform == 'youtube' and content_type == 'shorts' and duration <= 60:
                adjustments += 0.1
        
        # Calidad de producción
        production_quality = content_params.get('production_quality', 'medium')
        quality_multipliers = {'low': 0.8, 'medium': 1.0, 'high': 1.2, 'professional': 1.3}
        quality_multiplier = quality_multipliers.get(production_quality, 1.0)
        
        final_score = min(1.0, (base_score + adjustments) * quality_multiplier)
        return final_score
    
    def _generate_algorithm_recommendations(self, 
                                          slot_analysis: Dict,
                                          platform: str,
                                          content_params: Dict) -> List[str]:
        """Genera recomendaciones basadas en análisis algorítmico"""
        
        recommendations = []
        
        # Recomendaciones basadas en score
        if slot_analysis['algorithm_score'] > 0.8:
            recommendations.append("🟢 Excelente momento para publicar según algoritmo de la plataforma")
        elif slot_analysis['algorithm_score'] < 0.5:
            recommendations.append("🔴 Momento subóptimo - considerar retrasar publicación")
        
        # Recomendaciones específicas por plataforma
        if platform == 'instagram':
            if slot_analysis['peak_alignment'] > 0.8:
                recommendations.append("📈 Hora pico de Instagram - maximizar engagement inmediato")
            if 'reels' in content_params.get('content_type', ''):
                recommendations.append("🎬 Reels: Usar trending audio y hashtags relevantes")
        
        elif platform == 'tiktok':
            recommendations.append("⚡ TikTok: Primeros 3 segundos críticos para retención")
            if slot_analysis['algorithm_score'] > 0.7:
                recommendations.append("🔥 Buen momento para participar en trends")
        
        elif platform == 'twitter':
            if slot_analysis['peak_alignment'] > 0.7:
                recommendations.append("📰 Hora pico Twitter - ideal para noticias/actualizaciones")
            recommendations.append("💬 Incluir pregunta para fomentar replies")
        
        elif platform == 'linkedin':
            if slot_analysis.get('rule_scores', {}).get('linkedin_business_hours', {}).get('score', 0) > 0.8:
                recommendations.append("💼 Horario laboral óptimo para contenido profesional")
            recommendations.append("📝 Usar formato long-form para mayor alcance")
        
        elif platform == 'youtube':
            if 'shorts' in content_params.get('content_type', ''):
                recommendations.append("🎥 YouTube Shorts: Formato vertical 9:16 esencial")
            else:
                recommendations.append("👆 Optimizar thumbnail para CTR alto")
        
        # Recomendaciones de contenido
        content_score = slot_analysis.get('content_optimization', 0)
        if content_score < 0.7:
            recommendations.append("⚠️ Considerar optimizar contenido para esta plataforma")
        
        return recommendations[:5]  # Limitar a 5 recomendaciones
    
    def adaptive_algorithm_learning(self, performance_data: List[Dict]) -> Dict:
        """
        Sistema de aprendizaje adaptativo basado en performance real
        para ajustar reglas algorítmicas automáticamente
        """
        
        if not self.adaptive_learning_enabled:
            return {'status': 'disabled'}
        
        learning_results = {
            'updated_rules': [],
            'performance_insights': {},
            'confidence_scores': {},
            'recommendations': []
        }
        
        # Agrupar datos por plataforma
        platform_performance = defaultdict(list)
        for data in performance_data:
            platform = data.get('platform')
            if platform:
                platform_performance[platform].append(data)
        
        # Analizar performance por plataforma
        for platform, data_points in platform_performance.items():
            if platform not in self.platform_rules:
                continue
            
            platform_insights = self._analyze_platform_performance(platform, data_points)
            learning_results['performance_insights'][platform] = platform_insights
            
            # Ajustar reglas basado en insights
            rule_updates = self._update_platform_rules(platform, platform_insights)
            learning_results['updated_rules'].extend(rule_updates)
        
        return learning_results
    
    def _analyze_platform_performance(self, platform: str, performance_data: List[Dict]) -> Dict:
        """Analiza performance histórica para una plataforma específica"""
        
        df = pd.DataFrame(performance_data)
        
        insights = {
            'total_posts': len(df),
            'avg_engagement_rate': df['engagement_rate'].mean() if 'engagement_rate' in df.columns else 0,
            'best_posting_hours': [],
            'content_type_performance': {},
            'timing_patterns': {}
        }
        
        # Analizar mejores horas
        if 'posted_hour' in df.columns and 'engagement_rate' in df.columns:
            hourly_performance = df.groupby('posted_hour')['engagement_rate'].mean().sort_values(ascending=False)
            insights['best_posting_hours'] = hourly_performance.head(5).index.tolist()
        
        # Performance por tipo de contenido
        if 'content_type' in df.columns and 'engagement_rate' in df.columns:
            content_performance = df.groupby('content_type')['engagement_rate'].mean().to_dict()
            insights['content_type_performance'] = content_performance
        
        return insights
    
    def _update_platform_rules(self, platform: str, insights: Dict) -> List[Dict]:
        """Actualiza reglas de plataforma basado en insights de performance"""
        
        updates = []
        
        if platform not in self.platform_rules:
            return updates
        
        platform_rules = self.platform_rules[platform]
        
        # Ejemplo de actualización adaptativa
        best_hours = insights.get('best_posting_hours', [])
        if best_hours:
            # Actualizar ventanas de engagement peak
            current_metrics = self.platform_metrics[platform]
            
            # Convertir mejores horas a ventanas
            new_peak_windows = []
            for hour in best_hours[:3]:  # Top 3 horas
                new_peak_windows.append((hour, hour + 1))
            
            if new_peak_windows != current_metrics.peak_engagement_windows:
                current_metrics.peak_engagement_windows = new_peak_windows
                updates.append({
                    'platform': platform,
                    'type': 'peak_windows_update',
                    'old_windows': current_metrics.peak_engagement_windows,
                    'new_windows': new_peak_windows,
                    'confidence': 0.8
                })
        
        return updates

# Ejemplo de uso del Platform Algorithm Optimizer
def example_platform_algorithm_optimization():
    """Ejemplo práctico del optimizador de algoritmos de plataforma"""
    
    print("🤖 Iniciando optimizador de algoritmos de plataforma...")
    
    # Inicializar optimizador
    optimizer = PlatformAlgorithmOptimizer()
    
    # Parámetros de contenido de ejemplo
    content_scenarios = [
        {
            'name': 'Instagram Reels',
            'platform': 'instagram',
            'params': {
                'content_type': 'reels',
                'duration_seconds': 15,
                'production_quality': 'high',
                'hashtag_count': 3,
                'content_features': ['trending_audio']
            }
        },
        {
            'name': 'TikTok Video',
            'platform': 'tiktok',
            'params': {
                'content_type': 'video',
                'duration_seconds': 12,
                'production_quality': 'medium',
                'content_features': ['trending_hashtag']
            }
        },
        {
            'name': 'LinkedIn Article',
            'platform': 'linkedin',
            'params': {
                'content_type': 'text',
                'word_count': 200,
                'production_quality': 'high',
                'account_type': 'personal',
                'content_features': ['industry_keywords']
            }
        },
        {
            'name': 'Twitter Thread',
            'platform': 'twitter',
            'params': {
                'content_type': 'thread',
                'hashtag_count': 2,
                'production_quality': 'medium',
                'content_features': ['question', 'trending_topic']
            }
        }
    ]
    
    print(f"\n🎯 Analizando {len(content_scenarios)} escenarios de contenido...")
    
    # Optimizar cada escenario
    for scenario in content_scenarios:
        print(f"\n📱 Optimizando: {scenario['name']}")
        
        optimized_slots = optimizer.optimize_posting_schedule(
            platform=scenario['platform'],
            content_params=scenario['params'],
            target_timeframe_hours=48  # 2 días
        )
        
        # Mostrar top 5 horarios
        print(f"  🏆 Top 5 horarios optimizados:")
        for i, slot in enumerate(optimized_slots[:5]):
            print(f"  {i+1}. {slot['datetime'].strftime('%Y-%m-%d %H:%M')} - "
                  f"Score: {slot['algorithm_score']:.3f}")
            
            # Mostrar recomendación principal
            if slot['recommendations']:
                print(f"      💡 {slot['recommendations'][0]}")
        
        # Análisis detallado del mejor slot
        best_slot = optimized_slots[0]
        print(f"\n  📊 Análisis detallado del mejor slot:")
        print(f"      ⏰ Fecha/Hora: {best_slot['datetime'].strftime('%Y-%m-%d %H:%M')}")
        print(f"      🎯 Score Algorítmico: {best_slot['algorithm_score']:.3f}")
        print(f"      📈 Alineación con Picos: {best_slot['peak_alignment']:.3f}")
        print(f"      📊 Optimización de Contenido: {best_slot['content_optimization']:.3f}")
        print(f"      🔄 Impacto de Frecuencia: {best_slot['frequency_impact']:.3f}")
        
        # Mostrar reglas más relevantes
        print(f"      📋 Reglas algorítmicas aplicadas:")
        for rule_id, rule_info in best_slot['rule_scores'].items():
            if rule_info['score'] > 0.7:
                print(f"        ✅ {rule_id}: {rule_info['score']:.3f} - {rule_info['description'][:50]}...")
    
    # Ejemplo de aprendizaje adaptativo
    print(f"\n🧠 Ejemplo de aprendizaje adaptativo...")
    
    # Simular datos de performance
    performance_data = []
    for i in range(50):
        performance_data.append({
            'platform': np.random.choice(['instagram', 'tiktok', 'linkedin']),
            'posted_hour': np.random.randint(0, 24),
            'engagement_rate': np.random.uniform(0.02, 0.15),
            'content_type': np.random.choice(['image', 'video', 'text']),
            'performance_date': datetime.now() - timedelta(days=np.random.randint(1, 30))
        })
    
    # Ejecutar aprendizaje adaptativo
    learning_results = optimizer.adaptive_algorithm_learning(performance_data)
    
    print(f"  📈 Reglas actualizadas: {len(learning_results['updated_rules'])}")
    print(f"  🎯 Plataformas analizadas: {len(learning_results['performance_insights'])}")
    
    for platform, insights in learning_results['performance_insights'].items():
        print(f"    📱 {platform.title()}:")
        print(f"      📊 Posts analizados: {insights['total_posts']}")
        print(f"      📈 Engagement promedio: {insights['avg_engagement_rate']:.3f}")
        if insights['best_posting_hours']:
            best_hours = insights['best_posting_hours'][:3]
            print(f"      ⏰ Mejores horas: {', '.join(map(str, best_hours))}")
    
    return optimizer

if __name__ == "__main__":
    optimizer = example_platform_algorithm_optimization()
```

