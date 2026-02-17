<script setup>
defineProps({
  cow: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="cow-card-outer">
    <div class="cow-card-horizontal-fixed">
      <div class="card-image-horizontal-fixed">
        <img :src="cow.image" :alt="cow.name" />
        <div class="price-tag-horizontal-fixed">€{{ cow.price.toLocaleString() }}</div>
      </div>
      <div class="card-content-horizontal-fixed">
        <div class="card-header-horizontal-fixed">
          <h2>{{ cow.name }}</h2>
          <span class="age">{{ cow.age }} years old</span>
        </div>
        <div class="breed">{{ cow.breed }}</div>
        <div class="stats-horizontal-fixed">
          <div class="stat">
            <span class="stat-icon">⚖️</span>
            <span>{{ cow.weight }} kg</span>
          </div>
          <div class="stat">
            <span class="stat-icon">📍</span>
            <span>{{ cow.location }}</span>
          </div>
        </div>
        <p class="description">{{ cow.description }}</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.cow-card-horizontal-fixed {
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  transition: transform 0.3s;
  width: 100%;
  max-width: 900px;
  min-height: 420px;
  margin: 0 auto;
}

.card-image-horizontal-fixed {
  position: relative;
  width: 420px;
  height: 420px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image-horizontal-fixed img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.price-tag-horizontal-fixed {
  position: absolute;
    .cow-card-outer {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      min-height: 480px;
      padding: 32px 0;
    }
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.card-content-horizontal-fixed {
  flex: 1;
  padding: 48px 48px 48px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.card-header-horizontal-fixed {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
      .cow-card-outer {
        min-height: unset;
        padding: 8px 0;
      }

.card-header-horizontal-fixed h2 {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
}

.age {
  background: #f0f0f0;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 1rem;
  color: #666;
}

.breed {
  color: #4CAF50;
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 24px;
}

.stats-horizontal-fixed {
  display: flex;
  gap: 48px;
  margin-bottom: 24px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 1.05rem;
}

.stat-icon {
  font-size: 1.2rem;
}

.description {
  color: #555;
  line-height: 1.7;
  font-size: 1.15rem;
  margin: 0;
  padding-top: 18px;
  border-top: 1px solid #eee;
}

@media (max-width: 1200px) {
  .cow-card-horizontal-fixed {
    max-width: 98vw;
    min-height: 320px;
  }
  .card-image-horizontal-fixed {
    width: 320px;
    height: 320px;
  }
  .card-content-horizontal-fixed {
    padding: 24px;
  }
}
@media (max-width: 900px) {
  .cow-card-horizontal-fixed {
    flex-direction: column;
    max-width: 98vw;
    min-height: unset;
  }
  .card-image-horizontal-fixed {
    width: 100%;
    height: 220px;
  }
  .card-content-horizontal-fixed {
    padding: 16px;
  }
}
</style>

