<template>
<v-container>
 <v-card
    class="ma-1"
    color="secondary"
  >
  <div class="about">
    <h1>Listen you sonofabitch</h1>
    <h3>This is the ultimate high to the top shit eksöl</h3>
    <img :src="giphyUrl" />
  </div>
  </v-card>
  <v-card
    class="ma-1"
    color="secondary"
    >
    <v-card-title>
      Lizenzvereinbarung
    </v-card-title>
    <v-row>
      <v-col cols=12 sm=6>
          <v-icon 
          x-large
          >mdi-github</v-icon>
          <a href="https://github.com/andreasvogt89/wolf"> 
          <p>Backend</p></a>      
      </v-col>
      <v-col cols=12 sm=6>
          <v-icon
          x-large
          >mdi-github</v-icon>
          <a href="https://github.com/andreasvogt89/easyway"> 
          <p>Frontend</p> </a>   
      </v-col>
    </v-row>
    <v-card-subtitle>
      MIT License Copyright © by Andreas Vogt
    </v-card-subtitle>
     <v-card-text class="white--text pt-3">
Permission is hereby granted, free
of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice
(including the next paragraph) shall be included in all copies or substantial
portions of the Software.
<v-card-text class="white--text pt-3">
</v-card-text>
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
      
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — EASY WAY<strong> v0.0.2~</strong>
      </v-card-text>
  </v-card>
  </v-container>
</template>
<script>
import axios from 'axios';

export default {
  name:"About",
  data(){
    return {
      giphyUrl: "",
    }
  },
  created(){
    this.fetchGiphy()
  },
  methods:{
    async fetchGiphy(){
        await axios.get("https://api.giphy.com/v1/gifs/random",
        {params:{
         api_key:'',
        }
        }).then(res=>{
          console.log(res)
          this.giphyUrl = res.data.data.image_url
        }
        ).catch(()=>{
          
        })
    }
  }
  
}
</script>
<style scoped>
.about{
  color: #08a20d;
  padding: 5px;
}
h1{
  color: #08a20d;
}
h2{
  font-family: Gadugi;
  color: rgb(255, 255, 255);
}

h3{
  font-family: Bahnschrift;
  color: #c62b2b;
}
</style>