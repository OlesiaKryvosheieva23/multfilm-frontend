<script setup lang="ts">


const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')


</script>


<template>
  <div>

    <div class = "login-container">
      <h1>Login</h1>
    </div>
    <div class="form-floating mb-3">
      <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
      <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating">
      <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
      <label for="floatingPassword">Password</label>
    </div>
    <button class="btn btn-primary" type="submit">Submit</button>
  </div>

</template>

<style scoped>
.login-container{
  margin-top: 250px;


  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-primary{

  display: block;
  margin: 20px auto 0 auto;


}
</style>
