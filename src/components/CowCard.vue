<script setup>
defineProps({
  cow: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="cow-card">
    <div class="card-image">
      <img :src="cow.image" :alt="cow.name" />
      <div class="price-tag">€{{ cow.price.toLocaleString() }}</div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <h2>{{ cow.name }}</h2>
        <span class="age">{{ cow.age }} years old</span>
      </div>
      
      <div class="breed">{{ cow.breed }}</div>
      
      <div class="stats">
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
</template>

<style scoped>
.cow-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  transition: transform 0.3s;
}

.card-image {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price-tag {
  position: absolute;
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

.card-content {
  padding: 20px;
  text-align: left;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.card-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.age {
  background: #f0f0f0;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  color: #666;
}

.breed {
  color: #4CAF50;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.95rem;
}

.stat-icon {
  font-size: 1.1rem;
}

.description {
  color: #555;
  line-height: 1.5;
  font-size: 0.95rem;
  margin: 0;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
</style>

