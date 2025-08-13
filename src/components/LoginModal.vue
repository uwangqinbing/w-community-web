<template>
  <div class="modal-mask" v-if="visible">
    <div class="modal-container">
      <h3>{{ isLoginMode ? 'SIGN IN' : 'SIGN UP' }}</h3>
      <input 
        v-model="email" 
        placeholder="email" 
        class="modal-input"
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="password"
        class="modal-input"
      />
      <!-- 注册时显示用户名输入框 -->
      <input 
        v-if="!isLoginMode"
        v-model="username" 
        placeholder="username"
        class="modal-input"
      />
      <button @click="handleSubmit" class="login-btn">
        {{ isLoginMode ? 'sign in' : 'sign up' }}
      </button>
      <button @click="toggleMode" class="cancel-btn">
        {{ isLoginMode ? 'create account' : 'already have account' }}
      </button>
      <button @click="handleClose" class="cancel-btn">close</button>
      <p class="text-red-500" v-if="loginStore.loginError">
        {{ loginStore.loginError }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/store/loginStore';
import { defineEmits, defineProps } from 'vue';

const loginStore = useLoginStore();
const emit = defineEmits(['close']);
const props = defineProps({ visible: Boolean });

// 切换登录/注册模式
const isLoginMode = ref(true);
const email = ref('');
const password = ref('');
const username = ref(''); // 注册时的用户名

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  email.value = '';
  password.value = '';
  username.value = '';
  loginStore.loginError = null;
};

const handleSubmit = async () => {
  try {
    if (isLoginMode.value) {
      // 登录
      await loginStore.login({ email: email.value, password: password.value });
    } else {
      // 注册（传递用户名）
      await loginStore.register({ 
        email: email.value, 
        password: password.value,
        username: username.value 
      });
    }
    emit('close'); // 成功后关闭弹窗
  } catch (error) {
    // 错误由loginStore处理，这里不做额外操作
  }
};

const handleClose = () => {
  emit('close');
  email.value = '';
  password.value = '';
  username.value = '';
  loginStore.loginError = null;
};
</script>

<style>

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保弹窗在最上层 */
}
.modal-container {
  background:#1E1E1E;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.modal-input {
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #2C2C2C;
  color: #ccc;
  font-size: 14px;
}

.modal-input::placeholder {
  color: #888;
  opacity: 1;
}
.modal-input:focus {
  border-color: #6699CC;
  outline: none;
}
.login-btn {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  background: linear-gradient(90deg, #20D09C 0%, #19BEFF 100%); 
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.cancel-btn {
  width: 100%;
  padding: 8px;
  background: #333;
  border: none;
  border-radius: 4px;
  color: #CCC;
  cursor: pointer;
}
.text-red-500 {
  color: #ff4444;
  font-size: 12px;
  text-align: center;
  margin: 5px 0;
}
.modal-container h3 {
  color: #FFF;
  text-align: center;
  margin-bottom: 16px;
}
</style>