
module Guru

  class ClipEvents

    def initialize
      @data = [{time: (Time.now-4*60).iso8601,text: 'New Comment',type: :comment},
               {time: (Time.now-12*60).iso8601,text: '3 New Followers',type: :twitter},
               {time: (Time.now-27*60).iso8601,text: 'Message Sent',type: :envelope},
               {time: (Time.now-43*60).iso8601,text: 'New Task',type: :tasks},
               {time: (Time.now-130*60).iso8601,text: 'Server Rebooted',type: :upload},
               {time: (Time.now-133*60).iso8601,text: 'Server Crashed!',type: :bolt},
               {time: (Time.now-145*60).iso8601,text: 'Server Not Responding',type: :warning},
               {time: (Time.now-170*60).iso8601,text: 'New Order Placed',type: :shopping_cart},
               {time: (Time.now-1440*60).iso8601,text: 'Payment Received',type: :money}
              ]
    end

    def do_report
      @data
    end

  end

end