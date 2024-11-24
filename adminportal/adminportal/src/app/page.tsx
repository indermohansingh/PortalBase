import ShowLoginOrLogout from '../components/ShowLoginOrLogout'

export default async function Home() {
  return (
    <div>
      <div> Welcome to Admin Portal </div>
        <br></br>
        <div><ShowLoginOrLogout /> </div>
        <br></br>
        <a className="text-blue-500 hover:underline" href="/private">Secured Pages Here</a>
      </div>
  )
}
