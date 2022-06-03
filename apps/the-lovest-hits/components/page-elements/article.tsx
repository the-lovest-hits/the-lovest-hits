export function Article({ title, children }) {

  return (
    <section className="row">
      <div className="col-12 col-lg-8">
        <div className="article">
          <div className="article__content">
            <h4>{ title }</h4>
            { children }
          </div>
        </div>
      </div>
    </section>
  )
}
