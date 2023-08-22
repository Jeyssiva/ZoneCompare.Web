
import cv2
import requests
from io import BytesIO
from matplotlib import pyplot as plt
import numpy as np
from ZoningComparison.helper import Helper
from xml.dom import minidom
from azure.storage.blob import BlockBlobService, PublicAccess
import config
from ZoningComparison.logger import logger

class loadDocument():

    def __init__(self):
        self.config = config.BLOCKBLOBSERVICE['liveimages']
        self.account_name = self.config['account_name']
        self.account_key = self.config['key']
        self.container_name = self.config['container_name']
        self.url = self.config['url']
        self.sas_token = self.config['sas_token']
        self.block_blob_service = BlockBlobService(account_name=self.account_name, account_key=None,sas_token=self.sas_token)
        self._logger = logger.Logger() 

    def getdocuments(self,csid,docpages_zoned, imagelocationsandoutputxml):
        try:              
            i = 0
            tag_files = []
            tag_files_for_individual = []
            prevquesnum = -1
            for page in imagelocationsandoutputxml:
                autozone_images = ''
                manualzone_images = ''
                docpageid = page[0]
                img_location = page[1]
                blobname = img_location.split(self.container_name+'/')[1]
                blob = self.block_blob_service.get_blob_to_bytes(self.container_name,blobname)

                image_array = np.fromstring(blob.content,dtype='uint8')
                img_ndarray = cv2.imdecode(image_array, cv2.IMREAD_UNCHANGED)
                o_height,o_width, channels = img_ndarray.shape
                normal_image_auto = cv2.cvtColor(img_ndarray, cv2.COLOR_RGB2BGR)
                normal_image_manual = cv2.cvtColor(img_ndarray, cv2.COLOR_RGB2BGR)
                height = o_height if page[4] == None else page[4] 
                width = o_width if page[3] == None else page[3]
                copy_of_normal_image_auto = normal_image_auto.copy()

                if (page[8] != None):
                    xmldoc = minidom.parseString(str(page[8]))
                else:
                    xmldoc = None  

                if 'CS' in page[2]:
                    images = self.draw_grey_color(normal_image_auto,copy_of_normal_image_auto,0,0,width,height,0.5)
                    tag_files.append(self.set_images_as_tag(docpageid,images,images))
                else:
                    autozone_images, prevquesnum = self.images_for_autozone(xmldoc, normal_image_auto, width, height, 0.6,prevquesnum, page[2], page[9])
                    manualzone_images = self.images_for_manualzone(normal_image_manual,docpageid,docpages_zoned,height,width,0.6)
                    #tag_files.append(self.set_images_as_tag(docpageid,autozone_images,manualzone_images,page[5],page[6],page[7]))
                    tag_files_for_individual.append([docpageid,autozone_images,manualzone_images,page[5],page[6],page[7]])
                i = i + 1
            return tag_files_for_individual
        except Exception as ex:
            self._logger.log_exception(ex)
    
    def images_for_manualzone(self,ori_image,docpageid,docpages_zoned,totalheight, totalwidth,alpha):
        try:       
            rect_x = 0
            rect_w = totalwidth 
            rect_y = 0
            rect_h = 0
            for zone in docpages_zoned:
                if docpageid == zone[0]:
                    topinper = zone[3]
                    heightinper = int(zone[4])
                    if (topinper > 0):
                        rect_y = int(totalheight * (topinper/100))
                    else:
                        rect_y = int(rect_y + topinper)

                    rect_h = int(totalheight * (heightinper/100))
                    centre_width = int(rect_w/2) - 60
                    centre_height = int(rect_y + (rect_h/2))

                    cv2.rectangle(ori_image,(rect_x,rect_y),(rect_x + rect_w, rect_y + rect_h),(255, 0, 0), 5)
                    cv2.rectangle(ori_image,(centre_width,centre_height),(centre_width + 350, centre_height + 70),(255, 255, 255), -1)
                    cv2.putText(ori_image, str('Question-' + zone[2]), (centre_width + 5, centre_height+40), cv2.FONT_HERSHEY_PLAIN, 3, (0, 0, 255), 3)

            base64_image_m = Helper.img_base64str(ori_image)
            return base64_image_m
        except Exception as ex:
            self._logger.log_exception(ex)

    def images_for_autozone(self,xmlcontent,norm_image, width, height, alpha, prevquesnum, barcode,automarkstatus):
        try:
            xml_blocks = []
            rect_x = 0
            rect_y = 0
            h_barcodearea = 218 #barcode area
            h_for_process = height - h_barcodearea #actual height for draw the zoning

            rect_h = 0
            end_y = 0
            base_x = 15
            rect_w = width - base_x 

            if(xmlcontent != None):
                blocks = xmlcontent.getElementsByTagName('addData:Blocks')              
                i = 1                             
                pquesnumoncurpage = -1
                for block in blocks:
                    id_attri = block.attributes["Id"].value
                    block_node = block.childNodes[0]
                    page_index_attri = block_node.attributes["PageIndex"].value
                    x = int(block_node.childNodes[0].attributes["Left"].value) #x
                    y = int(block_node.childNodes[0].attributes["Top"].value) #y
                    w = int(block_node.childNodes[0].attributes["Right"].value) #w
                    h = int(block_node.childNodes[0].attributes["Bottom"].value) - int(block_node.childNodes[0].attributes["Top"].value) #h
                    
                    end_y = int(block_node.childNodes[0].attributes["Bottom"].value)
                    
                    cell = xmlcontent.getElementsByTagName('_Cell_' + str(i))[0]
                    blockref = cell.attributes['addData:BlockRef'].value
                    if(cell.firstChild != None):                
                        quesnum = cell.firstChild.data
                        pquesnumoncurpage = cell.firstChild.data
                    else:
                        if(pquesnumoncurpage != -1):
                            quesnum = pquesnumoncurpage
                        else:
                            quesnum = prevquesnum
                    xml_blocks.append([id_attri,x,y,w,h,end_y,blockref,quesnum,page_index_attri])         
                    i = i + 1
            elif(automarkstatus >= 5):
                xml_blocks.append([1,30,30,0,0,0,1,'99',1])

            bi = 1
            for b in xml_blocks:                               
                if(bi == 1): #first_paper's first block
                    rect_x = b[1] #x
                    rect_y = b[2] #y
                    end_y = b[5] #end_y
                    q_num = b[7] #quesnum
                    rect_h = b[4] #h
                elif (q_num == b[7]):
                    e_y = b[2] - end_y #calulate the distance
                    rect_h = rect_h + b[4] + e_y #add the distance between two blocks and box height also
                    end_y = b[5] #end_y                        
                elif (q_num != b[7]): #if prev quesnum and current quesnum is not equal, draw rectangle
                    e_y = b[2] - end_y #calulate the distance (y - end_y)
                    rect_h = rect_h + e_y #add the distance between two blocks
                    
                    centre_width = int(rect_x + (rect_w/2))
                    centre_height = int(rect_y + (rect_h/2))
                    
                    ques_num = '99' if q_num == -1 else q_num
                    strquesnum = 'Unknown Zone' if ques_num == '99' else 'Question-' + str(ques_num)

                    cv2.rectangle(norm_image,(rect_x,rect_y),(rect_w, rect_y + rect_h),(255, 0, 0), 5)
                    cv2.rectangle(norm_image,(centre_width,centre_height),(centre_width + 350, centre_height + 70),(255, 255, 255), -1)
                    cv2.putText(norm_image, strquesnum , (centre_width + 5, centre_height + 40), cv2.FONT_HERSHEY_PLAIN, 3, (0, 0, 255), 3)
                    
                    rect_x = b[1] #x
                    rect_y = b[2] #y
                    end_y = b[5] #end_y
                    q_num = b[7] #quesnum
                    rect_h = b[4] #h   

                if (len(xml_blocks) == bi):
                    # if the box is end of the page, subtract the end_y and total height and reduce the barcode's area
                    rect_h = rect_h + (h_for_process - end_y)

                    centre_width = int(rect_x + (rect_w/2))
                    centre_height = int(rect_y + (rect_h/2))

                    ques_num = '99' if q_num == -1 else q_num
                    strquesnum = 'Unknown Zone' if ques_num == '99' else 'Question-' + str(ques_num)

                    cv2.rectangle(norm_image,(rect_x,rect_y),(rect_w, rect_y + rect_h),(255, 0, 0), 5)
                    cv2.rectangle(norm_image,(centre_width,centre_height),(centre_width + 350, centre_height + 70),(255, 255, 255), -1)
                    cv2.putText(norm_image, strquesnum, (centre_width + 5, centre_height + 40), cv2.FONT_HERSHEY_PLAIN, 3, (0, 0, 255), 3)    

                bi = bi + 1
                prevquesnum = b[7]    
          
            base64_img = Helper.img_base64str(norm_image)
            return [base64_img,prevquesnum]
        except Exception as ex:
            self._logger.log_exception(ex)
            
    def draw_grey_color(self,nor_image,copy_image,x,y,w,h,alpha):
        cv2.rectangle(nor_image,(x,y),(x + w, y + h),(96,96,96), -1)
        cv2.addWeighted(nor_image, alpha, copy_image, 1 - alpha, 0, copy_image)
        base64_image_g = Helper.img_base64str(copy_image)
        return base64_image_g

    def set_images_as_tag(self,pageid,autozone_images,manualzone_images,accuracystatusid,exception_type,comments):     
        if(accuracystatusid == 1):
            checked = 'checked'
            isicondisplayneeded = 'none'
            value = 1
        else:
            checked = ''
            isicondisplayneeded = 'block'
            value = str(0) + '$' +  str(exception_type) + '$' + comments          
        divmain = '<div id="divmain_'+ str(pageid) +'">'
        div_auto = '<div id="adiv_' + str(pageid) +'" class="div-zone-size" >'
        div_manual = '<div id="mdiv_'+ str(pageid) +'" class="div-zone-size div-manual-position" >'
        div_check_box = '<div class="div-checkbox" id="cdiv_' + str(pageid) + '">'
        checkbox = '<input type="checkbox" onclick="applyaccuracybasedpage(this)" name="chkaccuracy" class="checkbox" id="chk_'+ str(pageid) +'" '+checked+'>'
        div_close = '</div>'
        img_auto = '<img id="aimg_' + str(pageid) +'" src="data:image/jpg;base64,'+ autozone_images +'" class="image-border">'
        img_manual = '<img id="mimg_' + str(pageid) +'" src="data:image/jpg;base64,'+ manualzone_images +'" class="image-border">' 
        img_excepicon = '<input type="image" class="imgexcepicon" onclick="updateexceptionstatus(this)" id="imgeicon_'+ str(pageid)+'" src="/static/images/exception_icon.png" style="display: '+ isicondisplayneeded +'">'
        hid_exception = '<input type="hidden" id="he_'+ str(pageid) +'" name="hidexception" value="'+str(value)+'">'

        tag_file = divmain + div_check_box + checkbox + img_excepicon + div_close + div_auto + img_auto + div_close + div_manual + img_manual + \
                    div_close +  hid_exception + div_close + "<br>"
        return tag_file
