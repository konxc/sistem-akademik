export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full my-2 px-6 py-12 bg-white rounded-xl shadow-lg flex flex-col items-center">
        <img
          src="https://smauiiyk.sch.id/wp-content/uploads/2025/06/logo.png"
          alt="Logo SMA UII"
          className="w-24 mb-6"
        />
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 text-center">
          Sistem Akademik SMA UII Yogyakarta
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Platform modern untuk manajemen akademik, penjadwalan, kelas, presensi, dan data pengguna terintegrasi LDAP. Dirancang khusus untuk kebutuhan SMA UII Yogyakarta.
        </p>
        <div className="grid grid-cols-1 gap-4 w-full">
          <a
            href="/dashboard"
            className="block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-center transition"
          >
            Masuk Dashboard
          </a>
          <a
            href="/scheduler"
            className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg text-center transition"
          >
            Penjadwalan Mata Pelajaran
          </a>
          <a
            href="/users"
            className="block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg text-center transition"
          >
            Manajemen Pengguna
          </a>
          <a
            href="/subject"
            className="block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg text-center transition"
          >
            Manajemen Mata Pelajaran
          </a>
          <a
            href="/class"
            className="block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg text-center transition"
          >
            Manajemen Kelas
          </a>
        </div>
        <div className="mt-8 text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} SMA UII Yogyakarta. Sistem Akademik Modern.
        </div>
      </div>
    </main>
  );
}