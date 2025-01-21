import React from 'react'

const Sidebar = () => {
  return (
    <div>
        <div className="sidebar1">
  <div className="header">
    <h1 style={{fontSize:"30px" , color:"white"}}>blaash</h1>
    <button className="back-btn">
    <i class="fa-solid fa-angle-left"></i>
    </button>
  </div>
  
  <div className="tags">
    <div className="tag">
      <i className="fas fa-home"></i>
      <span>Revenue</span>
    </div>
    <div className="tag">
      <i className="fas fa-play-circle"></i>
      <span>Shoppable video</span>
    </div>
    <div className="tag">
      <i className="fas fa-video"></i>
      <span>Story</span>
    </div>
    <div className="tag">
      <i className="fas fa-search"></i>
      <span>Live Commerce</span>
    </div>
    <div className="tag">
      <i className="fas fa-heart"></i>
      <span>PlayList Manager</span>
    </div>
    <div className="tag">
      <i className="fas fa-history"></i>
      <span>One Click Post</span>
    </div>
    <div className="tag">
      <i className="fas fa-calendar"></i>
      <span>Calendar</span>
    </div>
    <div className="tag">
    <i className="fas fa-cog"></i>
    <span>Hire Influencer</span>
    </div>
  </div>
</div>

    </div>
  )
}

export default Sidebar