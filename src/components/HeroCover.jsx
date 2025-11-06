import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/O-AdlP9lTPNz-i8a/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black pointer-events-none" />
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col items-start justify-end pb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
          Swap your schedule with ease
        </h1>
        <p className="mt-3 text-sm md:text-base text-white/80 max-w-2xl">
          A modern, interactive marketplace to offer and request swaps on your busy calendar. Secure, fast, and delightful.
        </p>
      </div>
    </section>
  );
}
