<template>
  <div
    class="modal-backdrop position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75"
    v-if="modalVisibility"
  ></div>
  <div
    class="modal d-block"
    tabindex="-1"
    role="dialog"
    aria-labelledby="authModalLabel"
    aria-hidden="true"
    v-if="modalVisibility"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="authModalLabel">Your Account</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click.prevent="modalVisibility = false"
          ></button>
        </div>

        <div class="modal-body">
          <div class="row mb-4">
            <div class="col">
              <button
                class="btn w-100"
                :class="{
                  'btn-primary text-white': tab === 'login',
                  'btn-outline-primary': tab !== 'login',
                }"
                @click.prevent="tab = 'login'"
              >
                Login
              </button>
            </div>
            <div class="col">
              <button
                class="btn w-100"
                :class="{
                  'btn-primary text-white': tab === 'register',
                  'btn-outline-primary': tab !== 'register',
                }"
                @click.prevent="tab = 'register'"
              >
                Register
              </button>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <app-login-form v-if="tab === 'login'" />
              <app-register-form v-else />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapWritableState } from 'pinia'
import useModalStore from '@/stores/modal'
import AppLoginForm from './LoginForm.vue'
import AppRegisterForm from './RegisterForm.vue'

export default {
  name: 'Auth',
  components: {
    AppLoginForm,
    AppRegisterForm,
  },
  data() {
    return {
      tab: 'login',
    }
  },
  computed: {
    ...mapState(useModalStore, ['hiddenClass']),
    ...mapWritableState(useModalStore, {
      modalVisibility: 'isOpen',
    }),
  },
}
</script>
