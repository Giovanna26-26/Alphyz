import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./home.css";


const Home = () => {
  const [frame, setFrame] = useState(0);

  // alterna entre frames automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const frames = [
    { background: "frame1" },
    { background: "frame2" },
    { background: "frame3" },
  ];

  return (
    <div className={`home-container ${frames[frame].background}`}>
      <motion.div
        key={frame}
        initial={{ opacity: 0, x: frame % 2 === 0 ? -100 : 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="home-content"
      >
      
      </motion.div>
       <div class="text-box">
    O fast fashion criou um ciclo de consumo rápido: a gente compra, usa pouco e descarta. Isso polui o meio ambiente, gasta recursos e incentiva um jeito de viver insustentável. Precisamos mudar essa lógica!
    A Alphyz é uma plataforma de economia criativa e moda sustentável baseada em trocas. Em vez de comprar sempre roupas novas, a pessoa pode circular peças, manter o estilo e ainda economizar. Nosso propósito vai além da moda, queremos criar uma comunidade que entende que consumir sem consciência esgota não só os recursos da Terra, mas também as possibilidades de futuro. 
       </div>
    </div>
  );
};

export default Home;